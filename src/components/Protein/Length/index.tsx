import React from 'react';

import Link from 'components/generic/Link';

type Props = {
  metadata: {
    length: number;
    fragment?: string;
  };
  orf?: number;
};

const Length = ({ metadata: { length, fragment }, orf }: Props) => {
  let fragmentText;
  if (fragment) {
    fragmentText = ` (${fragment === 'N' ? 'complete' : 'fragment'})`;
  }
  return (
    <Link
      to={({ description }) => ({
        description: {
          ...description,
          [description.main.key]: {
            ...description[description.main.key],
            detail: 'sequence',
          },
        },
        search: { orf },
      })}
    >
      {length} amino acids
      {fragmentText}
    </Link>
  );
};

export default Length;
