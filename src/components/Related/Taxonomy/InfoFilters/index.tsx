import React from 'react';
import { toPlural } from 'utils/pages/toPlural';

import cssBinder from 'styles/cssBinder';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = cssBinder(ebiGlobalStyles);

type Props = {
  filters?: Array<EndpointFilter>,
  focusType: Endpoint,
  databases: DBsInfo,
}
const InfoFilters = (
  {
    filters,
    focusType,
    databases,
  }: Props,
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
                  {(databases?.[db]?.name) || db}
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

export default InfoFilters;
