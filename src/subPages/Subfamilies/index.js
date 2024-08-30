// @flow
import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

// $FlowFixMe
import Table, { Column, PageSizeSelector } from 'components/Table';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import ListOfGOTerms from 'components/GoTerms/List';

import f from 'styles/foundation';

export const FunFamLink = ({ accession, children }) => {
  const parts = accession.split(':FF:');
  const lengthOfPrefix = 6;
  return parts.length === 2 ? (
    <Link
      target="_blank"
      className={f('ext')}
      href={`http://www.cathdb.info/version/latest/superfamily/${parts[0].slice(
        lengthOfPrefix,
      )}/funfam/${Number(parts[1])}`}
    >
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
};

export const PantherLink = ({ accession, children }) => (
  <Link
    target="_blank"
    className={f('ext')}
    href={`http://www.pantherdb.org/panther/family.do?clsAccession=${accession.toUpperCase()}`}
  >
    {children}
  </Link>
);

const SubfamiliesSubpage = (
  { data, search, db } /*: {
    data: {loading: boolean, ok: boolean, status: number, payload: ?Object, url: string},
    search: Object,
    db: string,
  }*/,
) => {
  if (data.loading) return <Loading />;

  let SubfamilyLink = 'span';
  if (db === 'panther') SubfamilyLink = PantherLink;
  if (db === 'cathgene3d') SubfamilyLink = FunFamLink;
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
            <SubfamilyLink accession={accession}>{accession}</SubfamilyLink>
          )}
        >
          Accession
        </Column>
        <Column
          dataKey="name"
          renderer={(name, { accession }) => (
            <SubfamilyLink accession={accession}>{name}</SubfamilyLink>
          )}
        >
          Name
        </Column>
        <Column
          dataKey="go_terms"
          renderer={(terms) => <ListOfGOTerms terms={terms} />}
        >
          GO terms
        </Column>
      </Table>
    </section>
  );
};
SubfamiliesSubpage.propTypes = {
  data: dataPropType,
  search: T.object,
  db: T.string,
};
const mapStateToUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description?.entry,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, { accession, db }, search) => {
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
          entry: { db, accession },
        }),
      query: s,
    });
  },
);
export const mapStateToProps = createSelector(
  (state) => state.customLocation.search,
  (state) => state.customLocation.description.entry.db,
  (search, db) => ({ search, db }),
);

export default loadData({
  getUrl: mapStateToUrl,
  mapStateToProps,
})(SubfamiliesSubpage);
