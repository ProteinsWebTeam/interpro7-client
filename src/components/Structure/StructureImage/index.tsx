import React from 'react';

import LazyImage from 'components/LazyImage';

const PDBE_IMAGES = 'https://www.ebi.ac.uk/pdbe/static/entry';

const SIZES = {
  front: 200,
  side: 100,
  top: 100,
} as const;

export type StructureImageView = keyof typeof SIZES;

type Props = {
  pdbId: string;
  view?: StructureImageView;
  alt?: string;
} & Omit<React.ComponentProps<'img'>, 'src' | 'alt' | 'ref'>;

const StructureImage = ({ pdbId, view = 'front', alt, ...props }: Props) => {
  const size = SIZES[view];
  return (
    <LazyImage
      src={`${PDBE_IMAGES}/${pdbId}_assembly_1_chain_${view}_image-${size}x${size}.png`}
      alt={alt ?? `structure with accession ${pdbId}, ${view} view`}
      {...props}
    />
  );
};

export default StructureImage;
