import React, { useEffect, useRef } from 'react';

import { createSelector } from 'reselect';
// Commented lines to disable Genome3D until its API is updated and stable
// import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import loadable from 'higherOrder/loadable';
import { Params } from 'higherOrder/loadData/extract-params';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

type Props = {
  tracks: Array<[string, Array<Record<string, unknown>>]>;
  chain: string;
  fixedHighlight: string;
  id: string;
};

export interface LoadedProps
  extends Props,
    // LoadDataProps<Genome3DStructurePayload, 'Genome3d'>,
    LoadDataProps<{ metadata: ProteinMetadata }, 'protein'> {}

const ProteinViewerLoaded = ({
  dataprotein,
  tracks,
  // dataGenome3d,
  chain,
  fixedHighlight,
  id,
}: LoadedProps) => {
  const protvistaEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!protvistaEl.current || !protvistaEl.current.addEventListener) return;
    const handleMouseover = (event: Event) => {
      const {
        detail: { eventType, highlight, feature },
      } = event as CustomEvent;
      if (eventType === 'mouseover' && feature.aa) {
        protvistaEl.current?.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              highlight,
              eventType: 'sequence-chain',
              chain,
              protein: dataprotein?.payload?.metadata?.accession,
            },
            bubbles: true,
            cancelable: true,
          })
        );
      }
    };
    protvistaEl.current.addEventListener('change', handleMouseover);

    return () => {
      if (protvistaEl.current)
        protvistaEl.current.removeEventListener('change', handleMouseover);
    };
  });

  const enrichedTracks = [...tracks];
  // const HTTP_OK = 200;
  //
  // if (
  //   dataGenome3d &&
  //   dataprotein &&
  //   !dataGenome3d?.loading &&
  //   !dataprotein?.loading &&
  //   dataGenome3d?.status === HTTP_OK
  // ) {
  //   const domains = dataGenome3d.payload?.data
  //     .map((d) => d.annotations)
  //     .flat(1)
  //     .filter(
  //       ({ uniprot_acc: protein }) =>
  //         protein === dataprotein?.payload?.metadata.accession
  //     );
  //   const domainsObj: Record<string, MinimalFeature & Record<string, unknown>> =
  //     {};
  //   for (const d of domains || []) {
  //     if (!(d.resource in domainsObj)) {
  //       domainsObj[d.resource] = {
  //         accession: `G3D:${d.resource}`,
  //         locations: [],
  //       };
  //     }
  //     domainsObj[d.resource].confidence = d.confidence;
  //     domainsObj[d.resource].protein = dataprotein.payload?.metadata.accession||'';
  //     domainsObj[d.resource].type = 'Predicted structural domain';
  //     domainsObj[d.resource].source_database = d.resource;
  //     domainsObj[d.resource].locations?.push({
  //       fragments: d.segments.map((s) => ({
  //         start: s.uniprot_start,
  //         end: s.uniprot_stop,
  //       })),
  //     });
  //   }
  //   enrichedTracks.push([
  //     'predicted_structural_domains_(Provided_by_genome3D)',
  //     Object.values(domainsObj),
  //   ]);
  // }
  return (
    <div ref={protvistaEl}>
      {!dataprotein || dataprotein.loading ? (
        <div>loading</div>
      ) : (
        <ProteinViewer
          protein={dataprotein.payload?.metadata}
          data={enrichedTracks}
          fixedHighlight={fixedHighlight}
          id={id}
        />
      )}
    </div>
  );
};

// const getGenome3dURL = createSelector(
//   (state: GlobalState) => state.settings.genome3d,
//   (state: GlobalState) =>
//     state.customLocation.description.structure.accession || '',
//   ({ protocol, hostname, port, root }: ParsedURLServer, accession: string) => {
//     return format({
//       protocol,
//       hostname,
//       port,
//       pathname: `${root}classification/11/pdb/${accession}`,
//       // TODO: Replace 11 for latest once included in the genome3d api
//     });
//   }
// );

// export default (accession: string) =>
//   loadData({
//     getUrl: getGenome3dURL,
//     propNamespace: 'Genome3d',
//   } as Params)(
//   loadData({
//     getUrl: createSelector(
//       (state: GlobalState) => state.settings.api,
//       ({ protocol, hostname, port, root }: ParsedURLServer) =>
//         `${protocol}//${hostname}:${port}${root}/protein/uniprot/${accession}`
//     ),
//     propNamespace: 'protein',
//   } as Params)(ProteinViewerLoaded)
// );

export default (accession: string) =>
  loadData<{ metadata: ProteinMetadata }, 'protein'>({
    getUrl: createSelector(
      (state: GlobalState) => state.settings.api,
      ({ protocol, hostname, port, root }: ParsedURLServer) =>
        `${protocol}//${hostname}:${port}${root}/protein/uniprot/${accession}`
    ),
    propNamespace: 'protein',
  } as Params)(ProteinViewerLoaded);
