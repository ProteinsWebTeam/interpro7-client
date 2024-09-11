import React, { PropsWithChildren } from 'react';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';

import Link from 'components/generic/Link';
import Callout from 'components/SimpleCommonComponents/Callout';
import getURLByAccession from 'utils/processDescription/getURLbyAccession';

import ExactGeneMatchWrapper from './Gene';

const INTERPRO_ACCESSION_PADDING = 6;

const ENTRY_NAME_REGEX = /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)?$/;

const canBeUniprotEntryName = (term: string): boolean => {
  return ENTRY_NAME_REGEX.test(term);
};

type WrapperProps = PropsWithChildren<{
  to: InterProPartialLocation;
}>;
const ExactMatchWrapper = ({ to, children }: WrapperProps) => {
  return (
    <Callout type="warning" icon="icon-arrow-alt-circle-right">
      <span>Found an exact match:</span> <Link to={to}>{children}</Link>
    </Callout>
  );
};

type Props = {
  searchValue?: string;
};
interface LoadedProps
  extends Props,
    LoadDataProps<UtilsAccessionPayload, 'Number'>,
    LoadDataProps<UtilsAccessionPayload> {}

export const ExactMatch = ({ searchValue, data, dataNumber }: LoadedProps) => {
  if (!data || !dataNumber) return null;
  const { payload } = data;
  const { payload: numberPayload } = dataNumber;
  if (!searchValue || (!payload && !numberPayload)) return null;
  const searchRE = new RegExp(
    `^(${searchValue}|IPR${searchValue.padStart(
      INTERPRO_ACCESSION_PADDING,
      '0',
    )})$`,
    'i',
  );
  const exactMatches = new Map();
  if (payload) {
    const {
      accession,
      endpoint: type,
      source_database: db,
      proteins,
    } = payload;
    if (typeof accession === 'string') {
      if (searchRE.test(accession)) {
        exactMatches.set(
          type,
          <ExactMatchWrapper
            key={type}
            to={{
              description: {
                main: { key: type as Endpoint },
                [type]: { db, accession },
              },
            }}
          >
            {type} {accession}
          </ExactMatchWrapper>,
        );
      }
      // For identifier names (ex: VAV_HUMAN)
      if (searchValue && searchValue.includes('_')) {
        exactMatches.set(
          type,
          <ExactMatchWrapper
            key={type}
            to={{
              description: {
                main: { key: type as Endpoint },
                [type]: { db, accession },
              },
            }}
          >
            {type} {accession} [ID: {searchValue.toUpperCase()}]
          </ExactMatchWrapper>,
        );
      }
    } else if (proteins?.length) {
      // for search with genes, where one ID can have multiple proteins
      const geneMatch: Record<
        string,
        { name: string; accessions: Array<string> }
      > = {};
      for (const { accession: acc, organism, tax_id: taxon } of proteins) {
        if (!geneMatch[taxon])
          geneMatch[taxon] = { name: organism, accessions: [] };
        geneMatch[taxon].accessions.push(acc);
      }
      exactMatches.set(
        'gene-match',
        <ExactGeneMatchWrapper
          key="gene-match"
          matches={Object.values(geneMatch)}
          gene={searchValue.toUpperCase()}
        />,
      );
    }
  }
  if (numberPayload) {
    const {
      accession: numberAccession,
      endpoint,
      source_database: sourceDB,
    } = numberPayload;
    exactMatches.set(
      endpoint,
      <ExactMatchWrapper
        key={endpoint}
        to={{
          description: {
            main: { key: endpoint as Endpoint },
            [endpoint]: { db: sourceDB, accession: numberAccession },
          },
        }}
      >
        {endpoint} {numberAccession}
      </ExactMatchWrapper>,
    );
  }

  if (!exactMatches.size) return null;
  return Array.from(exactMatches.values());
};

const getQueryTerm = createSelector(
  (query) => query,
  (query) => {
    const number = +query;
    if (!Number.isInteger(number)) return query;
    const stringified = number.toString();
    if (stringified.length > INTERPRO_ACCESSION_PADDING) return query;
    return `IPR${stringified.padStart(INTERPRO_ACCESSION_PADDING, '0')}`;
  },
);

const getSearchStringUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.search.value,
  ({ protocol, hostname, port, root }, searchValue) => {
    if (!searchValue) return null;
    const query = getQueryTerm(searchValue);
    if (getURLByAccession(query) || canBeUniprotEntryName(query)) {
      const param = `utils/accession/${query}`;
      return `${protocol}//${hostname}:${port}${root}${param}`;
    }
    return '';
  },
);

const getSearchNumberUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.search.value,
  ({ protocol, hostname, port, root }, searchValue) => {
    if (!searchValue) return null;
    if (Number.isInteger(+searchValue)) {
      return `${protocol}//${hostname}:${port}${root}utils/accession/${searchValue}`;
    }
    return '';
  },
);

export default loadData({
  getUrl: getSearchNumberUrl,
  propNamespace: 'Number',
} as LoadDataParameters)(
  loadData(getSearchStringUrl as LoadDataParameters)(ExactMatch),
);
