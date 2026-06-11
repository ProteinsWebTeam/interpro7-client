/**
 * Copyright (c) 2018-2020 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Column, Table } from 'molstar/lib/mol-data/db';
import { toTable } from 'molstar/lib/mol-io/reader/cif/schema';
import {
  Model,
  ResidueIndex,
  Unit,
  IndexedCustomProperty,
} from 'molstar/lib/mol-model/structure';
import {
  StructureElement,
  Structure,
} from 'molstar/lib/mol-model/structure/structure';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { MmcifFormat } from 'molstar/lib/mol-model-formats/structure/mmcif';
import { PropertyWrapper } from 'molstar/lib/mol-model-props/common/wrapper';
import { CustomProperty } from 'molstar/lib/mol-model-props/common/custom-property';
import { CustomModelProperty } from 'molstar/lib/mol-model-props/common/custom-model-property';
import { CustomPropertyDescriptor } from 'molstar/lib/mol-model/custom-property';
import { dateToUtcString } from 'molstar/lib/mol-util/date';
import { arraySetAdd } from 'molstar/lib/mol-util/array';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { AfConfidenceChainFilterValue } from 'actions/types';

export { AfConfidence };

let _getChainFilter: (() => AfConfidenceChainFilterValue) | null = null;

export function registerChainFilter(
  getFilter: (() => AfConfidenceChainFilterValue) | null,
): void {
  _getChainFilter = getFilter;
}

// Re-compute and re-inject the confidence score map into all models currently loaded
export async function reapplyAfConfidence(
  plugin: PluginContext,
): Promise<void> {
  const tempCtx = {} as CustomProperty.Context;
  for (const s of plugin.managers.structure.hierarchy.current.structures) {
    const model = s.cell.obj?.data.models[0] as Model | undefined;
    if (!model) continue;
    const info = AfConfidence.fromCif(tempCtx, model);
    if (!info) continue;
    AfConfidenceProvider.set(
      model,
      PD.getDefaultValues(AfConfidenceParams),
      info,
    );
  }
  // Re-apply the colour theme so the viewport updates.
  await plugin.dataTransaction(async () => {
    for (const s of plugin.managers.structure.hierarchy.current.structures) {
      await plugin.managers.structure.component.updateRepresentationsTheme(
        s.components,
        { color: 'af-confidence' as never },
      );
    }
  });
}

type AfConfidence = PropertyWrapper<
  | {
      score: IndexedCustomProperty.Residue<[number, string]>;
      category: string[];
    }
  | undefined
>;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace AfConfidence {
  export const DefaultServerUrl = '';

  export function isApplicable(model?: Model): boolean {
    return !!model; // && Model.isFromPdbArchive(model);
  }

  export interface Info {
    timestamp_utc: string;
  }

  export const Schema = {
    local_metric_values: {
      label_asym_id: Column.Schema.str,
      label_comp_id: Column.Schema.str,
      label_seq_id: Column.Schema.int,
      metric_id: Column.Schema.int,
      metric_value: Column.Schema.float,
      model_id: Column.Schema.int,
      ordinal_id: Column.Schema.int,
    },
  };
  export type Schema = typeof Schema;

  // eslint-disable-next-line no-inner-declarations
  function tryGetInfoFromCif(
    categoryName: string,
    model: Model,
  ): undefined | Info {
    if (
      !MmcifFormat.is(model.sourceData) ||
      !model.sourceData.data.frame.categoryNames.includes(categoryName)
    ) {
      return;
    }

    const timestampField =
      model.sourceData.data.frame.categories[categoryName].getField(
        'metric_value',
      );
    if (!timestampField || timestampField.rowCount === 0) return;

    return {
      timestamp_utc: timestampField.str(0) || dateToUtcString(new Date()),
    };
  }

  export function fromCif(
    ctx: CustomProperty.Context,
    model: Model,
  ): AfConfidence | undefined {
    const info = tryGetInfoFromCif('ma_qa_metric_local', model);
    if (!info) return;
    const data = getCifData(model);
    const metricMap = createScoreMapFromCif(model, data.residues);
    return { info, data: metricMap };
  }

  export async function fromCifOrServer(
    ctx: CustomProperty.Context,
    model: Model,
  ): Promise<unknown> {
    const cif = fromCif(ctx, model);
    return { value: cif };
  }

  export function getConfidenceScore(e: StructureElement.Location) {
    if (!Unit.isAtomic(e.unit)) return [-1, 'No Score'];
    const prop = AfConfidenceProvider.get(e.unit.model).value;
    if (!prop || !prop.data) return [-1, 'No Score'];
    const rI = e.unit.residueIndex[e.element];
    return prop.data.score.has(rI) ? prop.data.score.get(rI) : [-1, 'No Score'];
  }

  const _emptyArray: string[] = [];
  export function getCategories(structure?: Structure) {
    if (!structure) return _emptyArray;
    const prop = AfConfidenceProvider.get(structure.models[0]).value;
    if (!prop || !prop.data) return _emptyArray;
    return prop.data.category;
  }

  // eslint-disable-next-line no-inner-declarations
  function getCifData(model: Model) {
    if (!MmcifFormat.is(model.sourceData))
      throw new Error('Data format must be mmCIF.');
    return {
      residues: toTable(
        Schema.local_metric_values,
        model.sourceData.data.frame.categories.ma_qa_metric_local,
      ),
    };
  }
}

export const AfConfidenceParams = {
  serverUrl: PD.Text(AfConfidence.DefaultServerUrl, {
    description: 'JSON API Server URL',
  }),
};
export type AfConfidenceParams = typeof AfConfidenceParams;
export type AfConfidenceProps = PD.Values<AfConfidenceParams>;

export const AfConfidenceProvider: CustomModelProperty.Provider<
  AfConfidenceParams,
  AfConfidence
> = CustomModelProperty.createProvider({
  label: 'AF Confidence Score',
  descriptor: CustomPropertyDescriptor({
    name: 'af_confidence_score',
  }),
  type: 'static',
  defaultParams: AfConfidenceParams,
  getParams: (_data: Model) => AfConfidenceParams,
  isApplicable: (data: Model) => AfConfidence.isApplicable(data),
  //@ts-ignore
  obtain: async (
    ctx: CustomProperty.Context,
    data: Model,
    // props: Partial<AfConfidenceProps>
  ) => {
    // const p = { ...PD.getDefaultValues(AfConfidenceParams), ...props };
    return await AfConfidence.fromCifOrServer(ctx, data);
  },
});

function createScoreMapFromCif(
  modelData: Model,
  residueData: Table<typeof AfConfidence.Schema.local_metric_values>,
): AfConfidence['data'] | undefined {
  const ret = new Map<ResidueIndex, [number, string]>();
  const { label_asym_id, label_seq_id, metric_value, _rowCount } = residueData;

  const categories: string[] = [];
  const chainFilter = _getChainFilter?.() ?? null;

  for (let i = 0; i < _rowCount; i++) {
    const confidenceScore = metric_value.value(i);
    const asymId = label_asym_id.value(i);
    const seqId = label_seq_id.value(i);

    // When a chain filter is active (heterodimer/multimer), only map scores
    // for the selected chain's residues.
    if (chainFilter !== null) {
      if (asymId !== chainFilter.label_asym_id) continue;
      if (seqId < chainFilter.sequenceStart || seqId > chainFilter.sequenceEnd)
        continue;
    }

    const entityId =
      modelData.properties.structAsymMap.get(asymId)?.entity_id ?? '1';
    const idx = modelData.atomicHierarchy.index.findResidue(
      entityId,
      asymId,
      seqId,
      '',
    );

    let confidencyCategory = 'Very low';
    if (confidenceScore > 50 && confidenceScore <= 70) {
      confidencyCategory = 'Low';
    } else if (confidenceScore > 70 && confidenceScore <= 90) {
      confidencyCategory = 'Medium';
    } else if (confidenceScore > 90) {
      confidencyCategory = 'High';
    }

    ret.set(idx, [confidenceScore, confidencyCategory]);
    arraySetAdd(categories, confidencyCategory);
  }

  return {
    score: IndexedCustomProperty.fromResidueMap(ret),
    category: categories,
  };
}
