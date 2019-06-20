import React from 'react';
import T from 'prop-types';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, { Column } from 'components/Table';
import Link from 'components/generic/Link';
import { Genome3dLink } from 'components/ExtLink';

import MatchesOnProtein from './MatchesOnProtein';
import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiStyles);
const HTTP_404 = 404;
const List = ({ data, customLocation: { search } }) => {
  if (data.loading) return <Loading />;
  const data4table = data.payload.data.map(
    ({ accession, locations, metadata, tooltipContent, length }) => ({
      id: metadata.anno_id,
      accession,
      length,
      locations,
      tooltipContent,
      ...metadata,
    }),
  );
  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <Table
          dataTable={data4table}
          loading={data.loading}
          ok={data.ok}
          status={data.status}
          actualSize={data.payload.pager.total_entries}
          notFound={data.status === HTTP_404}
          rowKey={'id'}
          query={search}
        >
          <Column
            dataKey="accession"
            renderer={accession => (
              <Genome3dLink id={accession} className={f('ext')} />
            )}
          >
            Protein
          </Column>
          <Column
            dataKey="evidences"
            renderer={({ source: { url, id, name } }) => (
              <Link href={url} className={f('ext')}>
                {name}: {id}
              </Link>
            )}
          >
            Evidence
          </Column>
          <Column dataKey="confidence" />
          <Column
            dataKey="locations"
            renderer={(locations, { tooltipContent, accession, length }) => (
              <MatchesOnProtein
                matches={locations}
                tooltip={tooltipContent}
                accession={`${accession}`}
                length={length}
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
  customLocation: T.shape({
    search: T.object,
  }),
};
export default List;
