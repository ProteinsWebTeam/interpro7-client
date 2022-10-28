// @flow
import React, { useState } from 'react';
import T from 'prop-types';
import { capitalize } from 'lodash-es';

import { GoLink } from 'components/ExtLink';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { foundationPartial } from 'styles/foundation';

import local from '../style.css';

const f = foundationPartial(local);

/*::
type Props = {
  terms: typeof undefined | null | Array<{
    identifier: string, 
    name: string,
    category: {
      code: string,
      name: string,
    }
  }>,
  maxNumberOfTerms: number,
}
 */

const colors = {
  P: 'var(--colors-go-bp)',
  F: 'var(--colors-go-mf)',
  C: 'var(--colors-go-cc)',
};
const ListOfGOTerms = ({ terms, maxNumberOfTerms = 10 } /*: Props */) => {
  const [showMore, setShowMore] = useState(false);
  if (!terms) return null;
  const hasMany = terms.length > maxNumberOfTerms;
  const termsToShow =
    showMore || !hasMany ? terms : terms.slice(0, maxNumberOfTerms);
  return (
    <>
      {termsToShow.map(({ identifier, name: n, category: { code, name } }) => (
        <Tooltip
          key={identifier}
          title={`${capitalize(name.replace('_', ' '))}: ${n}`}
        >
          <GoLink
            id={identifier}
            className={f('go-terms', 'ext', 'tag')}
            style={{
              background: colors[code] || 'transparent',
            }}
          >
            {identifier}
          </GoLink>{' '}
        </Tooltip>
      ))}
      {terms.length !== termsToShow.length && (
        <button onClick={() => setShowMore(true)} className={f('link')}>
          Show {terms.length - maxNumberOfTerms} more
        </button>
      )}
    </>
  );
};
ListOfGOTerms.propTypes = {
  terms: T.arrayOf(
    T.shape({
      identifier: T.string,
      name: T.string,
    }),
  ),
};
export default ListOfGOTerms;
