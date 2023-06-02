import React from 'react';

import { ExtendedFeature } from '../..';

import cssBinder from 'styles/cssBinder';

import grid from '../../../ProtVista/grid.css';

const css = cssBinder(grid);

type Props = {
  entry: ExtendedFeature;
  expandedTrack: boolean;
};

const ResidueLabel = ({ entry, expandedTrack }: Props) => {
  if (!entry.residues) return null;
  return (
    <>
      {entry.residues.map((residue) =>
        residue.locations.map((r, i) => (
          <div
            key={`res_${r.accession}_${i}`}
            className={css('track-accession-child', {
              hide: !expandedTrack,
            })}
          >
            <span>
              {r.description
                ? r.description.charAt(0).toUpperCase() + r.description.slice(1)
                : r.accession}
            </span>
          </div>
        ))
      )}
    </>
  );
};

export default ResidueLabel;
