// @flow
import React from 'react';
import T from 'prop-types';
import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

const InfoFilters = (
  {
    filters,
    focusType,
    databases,
  } /*: {filters?: Array<Object>, focusType: string, databases: Object} */,
) => {
  if (!filters || filters.length === 0) return null;
  return (
    <div className={f('callout', 'info', 'withicon')}>
      This list shows only:
      <ul>
        {filters.map(([endpoint, { db, accession }]) => (
          <li key={endpoint}>
            {toPlural(focusType)} associated with{' '}
            <b>{accession ? endpoint : toPlural(endpoint)}</b>
            {accession && (
              <span>
                {' '}
                accession <b>{accession}</b>
              </span>
            )}
            {db && (
              <span>
                {' '}
                from the <b>
                  {(databases[db] && databases[db].name) || db}
                </b>{' '}
                database
              </span>
            )}
            .
          </li>
        ))}
      </ul>
    </div>
  );
};
InfoFilters.propTypes = {
  databases: T.object.isRequired,
  focusType: T.string.isRequired,
  filters: T.array,
};

export default InfoFilters;
