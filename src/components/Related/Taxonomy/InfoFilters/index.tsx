import React from 'react';
import { toPlural } from 'utils/pages/toPlural';
import Callout from 'components/SimpleCommonComponents/Callout';

type Props = {
  filters?: Array<EndpointFilter>;
  focusType: Endpoint;
  databases: DBsInfo;
};
const InfoFilters = ({ filters, focusType, databases }: Props) => {
  if (!filters || filters.length === 0) return null;
  return (
    <Callout type="info">
      <p>
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
                  from the <b>{databases?.[db]?.name || db}</b> database
                </span>
              )}
              .
            </li>
          ))}
        </ul>
      </p>
    </Callout>
  );
};

export default InfoFilters;
