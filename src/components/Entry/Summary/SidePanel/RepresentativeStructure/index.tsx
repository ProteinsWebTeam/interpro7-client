import React, { useState } from 'react';

import StructureImage from 'components/Structure/StructureImage';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import local from '../style.css';

const css = cssBinder(local);

const RepresentativeStructure = ({
  accession,
  name,
}: {
  accession: string;
  name: string;
}) => {
  const [hiddenImages, setHiddenImages] = useState<Record<string, boolean>>({});
  const hideImage = (view: string) => () =>
    setHiddenImages((previous) => ({ ...previous, [view]: true }));

  return (
    <div className={css('side-panel')}>
      <div className={css('side-box')}>
        <h5>Representative structure</h5>
        <Link
          className={css('nolink')}
          to={{
            description: {
              main: { key: 'structure' },
              structure: { db: 'pdb', accession },
            },
          }}
        >
          <div className={css('structure-images')}>
            {!hiddenImages.front && (
              <StructureImage
                pdbId={accession}
                view="front"
                onError={hideImage('front')}
              />
            )}
            <div className={css('structure-images-side')}>
              {!hiddenImages.side && (
                <StructureImage
                  pdbId={accession}
                  view="side"
                  onError={hideImage('side')}
                />
              )}
              {!hiddenImages.top && (
                <StructureImage
                  pdbId={accession}
                  view="top"
                  onError={hideImage('top')}
                />
              )}
            </div>
          </div>

          <div>
            <b>{accession}</b>: {name}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RepresentativeStructure;
