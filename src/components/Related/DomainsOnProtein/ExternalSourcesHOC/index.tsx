import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import { formatGenome3dIntoProtVistaPanels } from 'components/Genome3D';
import formatRepeatsDB from './RepeatsDB';
import formatDisProt from './DisProt';

export type ExtenalSourcesProps = {
  loading: boolean;
  externalSourcesData: MinimalFeature[];
};
export function loadExternalSources<
  T extends ExtenalSourcesProps = ExtenalSourcesProps,
>(WrappedComponent: React.ComponentType<T>) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  type Props = Omit<T, keyof ExtenalSourcesProps> &
    LoadDataProps<Genome3DProteinPayload, 'Genome3D'> &
    LoadDataProps<DisProtPayload, 'DisProt'> &
    LoadDataProps<RepeatsDBPayload, 'RepeatsDB'>;

  const ComponentWithExternalData = (props: Props) => {
    const {
      dataGenome3D,
      isStaleGenome3D: _,
      dataRepeatsDB,
      isStaleRepeatsDB: __,
      dataDisProt,
      isStaleDisProt: ___,
      ...otherProps
    } = props;

    const genome3dFormatted = dataGenome3D
      ? formatGenome3dIntoProtVistaPanels(dataGenome3D)
      : [];
    const repeatsDBFormatted = dataRepeatsDB
      ? formatRepeatsDB(dataRepeatsDB)
      : [];
    const disprotFormatted = dataDisProt ? formatDisProt(dataDisProt) : [];

    // TODO: Add Disprot

    // Fetch the props you want to inject. This could be done with context instead.
    const newProps = {
      loading: !!dataGenome3D?.loading,
      externalSourcesData: [
        ...genome3dFormatted,
        ...repeatsDBFormatted,
        ...disprotFormatted,
      ],
    };

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...newProps} {...(otherProps as T)} />;
  };

  ComponentWithExternalData.displayName = `loadExternalSources(${displayName})`;

  return loadData<RepeatsDBPayload, 'RepeatsDB'>({
    getUrl: getRepeatsDBURL,
    propNamespace: 'RepeatsDB',
  } as Params)(
    loadData<DisProtPayload, 'DisProt'>({
      getUrl: getDisProtURL,
      propNamespace: 'DisProt',
    } as Params)(
      loadData<Genome3DProteinPayload, 'Genome3D'>({
        getUrl: getGenome3dURL,
        propNamespace: 'Genome3D',
      } as Params)(ComponentWithExternalData),
    ),
  );
}

const getGenome3dURL = createSelector(
  (state: GlobalState) => state.settings.genome3d,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    accession: string | null,
  ) => {
    if (!accession) return null;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}uniprot/${accession}`,
      query: {
        protvista: true,
      },
    });
  },
);

const getRepeatsDBURL = createSelector(
  (state: GlobalState) => state.settings.repeatsDB,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    accession: string | null,
  ) => {
    if (!accession) return null;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}`,
      query: {
        query: `uniprot_id:${accession}`,
      },
    });
  },
);
const getDisProtURL = createSelector(
  (state: GlobalState) => state.settings.disprot,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    accession: string | null,
  ) => {
    if (!accession) return null;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}/${accession}`,
      query: {
        format: 'json',
      },
    });
  },
);

export default loadExternalSources;
