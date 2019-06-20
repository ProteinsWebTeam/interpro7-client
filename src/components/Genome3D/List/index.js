import React from 'react';
import T from 'prop-types';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, { Column } from 'components/Table';
import Link from 'components/generic/Link';

import MatchesOnProtein from './MatchesOnProtein';
import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiStyles);
const HTTP_404 = 404;
const List = ({ data }) => {
  if (data.loading) return <Loading />;
  const data4table = data.payload.data.map(
    ({ accession, locations, metadata, tooltipContent }) => ({
      accession,
      locations,
      tooltipContent,
      ...metadata,
    }),
  );
  return (
    <div className={f('row')}>
      <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
        <Table
          dataTable={data4table}
          loading={data.loading}
          ok={data.ok}
          status={data.status}
          actualSize={data.payload.pager.total_entries}
          notFound={data.status === HTTP_404}
        >
          <Column dataKey="accession" />
          <Column
            dataKey="evidences"
            renderer={evidences =>
              evidences.map(({ source: { url, id, name } }) => (
                <Link href={url} key={id}>
                  {name}: {id}
                </Link>
              ))
            }
          >
            Evidence
          </Column>
          <Column dataKey="confidence" />
          <Column dataKey="resource" />
          <Column
            dataKey="locations"
            renderer={(locations, { tooltipContent, accession }) => (
              <MatchesOnProtein
                matches={locations}
                tooltip={tooltipContent}
                accession={`${accession}`}
              />
            )}
          >
            Matches
          </Column>
        </Table>
      </div>
    </div>
  );
};
List.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
};
export default List;
