import React, { useState } from 'react';

import LazyImage from 'components/LazyImage';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import local from '../style.css';

const css = cssBinder(local);

const PDBE_IMAGES = 'https://www.ebi.ac.uk/pdbe/static/entry';

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
              <LazyImage
                src={`${PDBE_IMAGES}/${accession}_assembly_1_chain_front_image-200x200.png`}
                alt={`structure with accession ${accession}, front view`}
                onError={hideImage('front')}
              />
            )}
            <div className={css('structure-images-side')}>
              {!hiddenImages.side && (
                <LazyImage
                  src={`${PDBE_IMAGES}/${accession}_assembly_1_chain_side_image-100x100.png`}
                  alt={`structure with accession ${accession}, side view`}
                  onError={hideImage('side')}
                />
              )}
              {!hiddenImages.top && (
                <LazyImage
                  src={`${PDBE_IMAGES}/${accession}_assembly_1_chain_top_image-100x100.png`}
                  alt={`structure with accession ${accession}, top view`}
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
