import React, { useEffect, useRef } from 'react';

import loadable from 'higherOrder/loadable';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

type Props = {
  tracks: Array<[string, Array<Record<string, unknown>>]>;
  chain: string;
  fixedHighlight?: string;
  id: string;
  protein: { accession: string; length: number; sequence: string };
};

const ProteinViewerLoaded = ({ protein, tracks, chain, id }: Props) => {
  const protvistaEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!protvistaEl.current || !protvistaEl.current.addEventListener) return;
    const handleMouseover = (event: Event) => {
      console.log(event);
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
              protein: protein.accession,
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

  return (
    <div ref={protvistaEl}>
      <ProteinViewer protein={protein} data={enrichedTracks} id={id} />
    </div>
  );
};

export default ProteinViewerLoaded;
