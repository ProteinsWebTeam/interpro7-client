// @flow
import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import Table, { Column, PageSizeSelector } from 'components/Table';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import f from 'styles/foundation';

const SubfamiliesSubpage = (
  { data, search } /*: {
    data: {loading: boolean, ok: boolean, status: number, payload: ?Object, url: string},
    search: Object,
  }*/,
) => {
  if (data.loading) return <Loading />;

  return (
    <section>
      <Table
        dataTable={data.payload?.results.map((e) => e.metadata) || []}
        contentType="search"
        loading={data.loading}
        status={data.status}
        ok={data.ok}
        query={search}
        actualSize={data.payload?.count || 0}
        nextAPICall={data.payload?.next}
        previousAPICall={data.payload?.previous}
        currentAPICall={data.url}
      >
        <PageSizeSelector />
        <Column
          dataKey="accession"
          renderer={(accession) => (
            <Link
              target="_blank"
              className={f('ext')}
              href={`http://www.pantherdb.org/panther/family.do?clsAccession=${accession.toUpperCase()}`}
            >
              {accession}
            </Link>
          )}
        >
          Accession
        </Column>
        <Column
          dataKey="name"
          renderer={(name, { accession }) => (
            <Link
              target="_blank"
              className={f('ext')}
              href={`http://www.pantherdb.org/panther/family.do?clsAccession=${accession.toUpperCase()}`}
            >
              {name}
            </Link>
          )}
        >
          Accession
        </Column>
      </Table>
    </section>
  );
};
SubfamiliesSubpage.propTypes = {
  data: dataPropType,
  search: T.object,
};
const mapStateToUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description?.entry?.accession,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, accession, search) => {
    const s = {
      ...search,
      subfamilies: '',
    };
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'entry' },
          entry: { db: 'panther', accession },
        }),
      query: s,
    });
  },
);
export const mapStateToProps = createSelector(
  (state) => state.customLocation.search,
  (search) => ({ search }),
);

export default loadData({
  getUrl: mapStateToUrl,
  mapStateToProps,
})(SubfamiliesSubpage);
