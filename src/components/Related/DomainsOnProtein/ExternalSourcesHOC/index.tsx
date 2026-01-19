import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import formatRepeatsDB from './RepeatsDB';
import formatDisProt from './DisProt';
import formatTED from './TED';

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
    LoadDataProps<DisProtPayload, 'DisProt'> &
    LoadDataProps<RepeatsDBPayload, 'RepeatsDB'> &
    LoadDataProps<TEDPayload, 'TED'>;

  const ComponentWithExternalData = (props: Props) => {
    const {
      dataRepeatsDB,
      isStaleRepeatsDB: __,
      dataDisProt,
      isStaleDisProt: ___,
      dataTED,
      isStaleDisProt: _,
      ...otherProps
    } = props;

    const repeatsDBFormatted = dataRepeatsDB
      ? formatRepeatsDB(dataRepeatsDB)
      : [];
    const disprotFormatted = dataDisProt ? formatDisProt(dataDisProt) : [];
    const tedFormatted = dataTED ? formatTED(dataTED) : [];

    // Fetch the props you want to inject. This could be done with context instead.
    const newProps = {
      externalSourcesData: [
        ...repeatsDBFormatted,
        ...disprotFormatted,
        ...tedFormatted,
      ],
    };

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...newProps} {...(otherProps as T)} />;
  };

  ComponentWithExternalData.displayName = `loadExternalSources(${displayName})`;

  return loadData<RepeatsDBPayload, 'RepeatsDB'>({
    getUrl: getRepeatsDBURL,
    propNamespace: 'RepeatsDB',
  } as LoadDataParameters)(
    loadData<DisProtPayload, 'DisProt'>({
      getUrl: getDisProtURL,
      propNamespace: 'DisProt',
    } as LoadDataParameters)(
      loadData<TEDPayload, 'TED'>({
        getUrl: getTEDURL,
        propNamespace: 'TED',
      } as LoadDataParameters)(ComponentWithExternalData),
    ),
  );
}

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
        'chain.structure': `${accession}`,
        'chain.id': 'A',
        skip: '0',
        limit: '1',
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

export const getTEDURL = createSelector(
  (state: GlobalState) => state.settings.alphafold,
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
      pathname: `${root}/api/domains/${accession}`.replaceAll(/\/{2,}/g, '/'),
    });
  },
);

export default loadExternalSources;
