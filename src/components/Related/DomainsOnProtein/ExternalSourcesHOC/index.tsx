import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import { formatGenome3dIntoProtVistaPanels } from 'components/Genome3D';

export type ExtenalSourcesProps = {
  loading: boolean;
  externalSourcesData: MinimalFeature[];
};
export function loadExternalSources<
  T extends ExtenalSourcesProps = ExtenalSourcesProps
>(WrappedComponent: React.ComponentType<T>) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  type Props = Omit<T, keyof ExtenalSourcesProps> &
    LoadDataProps<Genome3DProteinPayload, 'Genome3D'>;

  const ComponentWithExternalData = (props: Props) => {
    const { dataGenome3D, isStaleGenome3D: _, ...otherProps } = props;

    const genome3dFormatted = dataGenome3D
      ? formatGenome3dIntoProtVistaPanels(dataGenome3D)
      : [];
    // Fetch the props you want to inject. This could be done with context instead.
    const newProps = {
      loading: !!dataGenome3D?.loading,
      externalSourcesData: [...genome3dFormatted],
    };

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...newProps} {...(otherProps as T)} />;
  };

  ComponentWithExternalData.displayName = `loadExternalSources(${displayName})`;

  return loadData<Genome3DProteinPayload, 'Genome3D'>({
    getUrl: getGenome3dURL,
    propNamespace: 'Genome3D',
  } as Params)(ComponentWithExternalData);
}

const getGenome3dURL = createSelector(
  (state: GlobalState) => state.settings.genome3d,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  ({ protocol, hostname, port, root }: ParsedURLServer, accession: string) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}uniprot/${accession}`,
      query: {
        protvista: true,
      },
    });
  }
);

export default loadExternalSources;
