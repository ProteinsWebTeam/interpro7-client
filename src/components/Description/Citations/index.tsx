import React from 'react';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import styles from '../style.css';

const css = cssBinder(styles);

export const CITATION_REGEX = '\\[cite:(PUB\\d+)\\](,\\s*)?';

type Props = {
  text: string;
  literature?: Array<[string, Reference]>;
  accession: string;
  withoutIDs: boolean;
};
const Citations = ({ text, literature = [], withoutIDs, accession }: Props) => (
  <sup>
    [
    {text.split(',').map((cita, i, array) => {
      const citMatch = cita.match(CITATION_REGEX);
      if (!citMatch || citMatch.length < 2) {
        return null;
      }
      const pubId = citMatch[1];
      const refCounter = literature.map((d) => d[0]).indexOf(pubId) + 1;
      return (
        <Link
          key={cita}
          id={withoutIDs ? null : `description-${refCounter}`}
          className={css('text-high')}
          to={(customLocation) => {
            const key = customLocation.description.main.key;
            return {
              ...customLocation,
              description: {
                main: { key },
                [key]: {
                  db: customLocation.description[key].db,
                  accession,
                },
              },
              hash: pubId,
            };
          }}
        >
          {refCounter}
          {i + 1 < array.length && ', '}
        </Link>
      );
    })}
    ]
  </sup>
);

export default Citations;
