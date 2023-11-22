import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';
import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import { useProcessData } from 'components/ProteinViewer/utils';

type StructureWithSecondary = {
  metadata: StructureMetadata;
  extra_fields: { secondary_structures: Array<SecondaryStructure> };
};
export interface LoadedProps
  extends LoadDataProps<PayloadList<EndpointWithMatchesPayload<EntryMetadata>>>,
    LoadDataProps<StructureWithSecondary, 'Secondary'> {
  structure: string;
}

const ProteinViewerForStructure = ({
  structure,
  data,
  dataSecondary,
}: LoadedProps) => {
  const processedData = useProcessData(data?.payload?.results, 'structure');
  if (!data || data.loading) return <Loading />;

  let secondaryData;
  if (dataSecondary && !dataSecondary.loading && dataSecondary.payload) {
    if (
      dataSecondary.payload.extra_fields &&
      dataSecondary.payload.extra_fields.secondary_structures
    ) {
      secondaryData = dataSecondary.payload.extra_fields.secondary_structures;
    }
  }
  if (!data.payload || !processedData) return null;
  const { interpro, unintegrated, representativeDomains } = processedData;
  return (
    <div>
      <EntriesOnStructure
        structure={structure}
        entries={interpro.concat(unintegrated) as StructureLinkedObject[]}
        secondaryStructures={secondaryData}
        representativeDomains={representativeDomains}
      />
    </div>
  );
};

export const getURLForMatches = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.structure,
  ({ protocol, hostname, port, root }, { accession }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}${descriptionToPath({
        main: { key: 'entry' },
        structure: { isFilter: true, db: 'pdb', accession },
        entry: { db: 'all' },
      })}`,
      query: {
        page_size: 200,
        extra_fields: 'short_name',
      },
    }),
);
const getSecondaryStructureURL = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.structure,
  ({ protocol, hostname, port, root }, { db, accession }) => {
    const newDesc = {
      main: { key: 'structure' },
      structure: { db, accession },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        extra_fields: 'secondary_structures',
      },
    });
  },
);

export default loadData<StructureWithSecondary, 'Secondary'>({
  propNamespace: 'Secondary',
  getUrl: getSecondaryStructureURL,
} as Params)(
  loadData<PayloadList<EndpointWithMatchesPayload<EntryMetadata>>>(
    getURLForMatches,
  )(ProteinViewerForStructure),
);
