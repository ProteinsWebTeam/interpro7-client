import React from 'react';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import styles from '../style.css';

const css = cssBinder(styles);

export const CITATION_REGEX = '\\[cite:(PUB\\d+)\\](,\\s*)?';
export const PMID_REGEX = '\\[PMID:\\d+(?:,PMID:\\d+)*\\]';
export const PMID_REGEX_SINGLE = 'PMID:(\\d+)';

type Props = {
  text: string;
  literature?: Array<[string, Reference]>;
  withoutIDs: boolean;
};
const Citations = ({ text, literature = [], withoutIDs }: Props) => (
  <sup>
    [
    {text.split(',').map((cita, i, array) => {
      const citMatch = cita.match(PMID_REGEX_SINGLE);
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
            return {
              ...customLocation,
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
