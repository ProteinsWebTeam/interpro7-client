import React from 'react';

import Link from 'components/generic/Link';

type Props = {
  metadata: {
    length: number;
    fragment?: string;
  };
};

const Length = ({ metadata: { length, fragment } }: Props) => {
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
      })}
    >
      {length} amino acids
      {fragmentText}
    </Link>
  );
};

export default Length;
