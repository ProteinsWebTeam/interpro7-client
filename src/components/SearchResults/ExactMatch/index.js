import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import getURLByAccession from 'utils/processDescription/getURLbyAccession';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const INTERPRO_ACCESSION_PADDING = 6;

const ENTRY_NAME_REGEX = /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)?$/;

const canBeUniprotEntryName = (term /*: string */) /*: boolean */ => {
  return ENTRY_NAME_REGEX.test(term);
};

/*:: type EMWProps = {
  to: Object,
  children: any,
}; */
class ExactMatchWrapper extends PureComponent /*:: <EMWProps> */ {
  static propTypes = {
    to: T.object.isRequired,
    children: T.any.isRequired,
  };

  render() {
    const { to, children } = this.props;
    return (
      <div className={f('callout', 'warning', 'margin-bottom-medium')}>
        <span className={f('icon', 'icon-common')} data-icon="&#xf35a;">
          {' '}
          Found an exact match:
        </span>{' '}
        <Link to={to}>{children}</Link>
      </div>
    );
  }
}

/*:: type EMGWProps = {
  matches: {
    accession: string[],
    name: string,
  },
  gene: string,
}; */
const ExactGeneMatchWrapper = ({ matches, gene }) => (
  <div className={f('callout', 'warning', 'margin-bottom-medium')}>
    <span className={f('icon', 'icon-common')} data-icon="&#xf35a;">
      {' '}
      Found an exact gene match for <b>{gene}</b>:
    </span>{' '}
    <ul>
      {matches.map(({ accessions, name }) => (
        <li key={name}>
          <b>{name}</b>:{' '}
          {accessions.map((accession, i) => (
            <Fragment key={accession}>
              {i > 0 ? ', ' : ''}
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: { db: 'uniprot', accession },
                  },
                }}
              >
                {accession}
              </Link>
            </Fragment>
          ))}
        </li>
      ))}
    </ul>
  </div>
);
ExactGeneMatchWrapper.propTypes = {
  matches: T.arrayOf(
    T.shape({
      accession: T.arrayOf(T.string),
      name: T.string,
    }),
  ),
  gene: T.string,
};

/*:: type SMProps = {
  data: {
    payload: Object,
  },
  dataNumber: {
    payload: Object,
  },
  searchValue: ?string,
} */
export class ExactMatch extends PureComponent /*:: <SMProps> */ {
  static propTypes = {
    data: dataPropType,
    dataNumber: dataPropType,
    searchValue: T.string,
  };

  render() {
    const {
      searchValue,
      data: { payload },
      dataNumber: { payload: numberPayload },
    } = this.props;
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
                  main: { key: type },
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
                  main: { key: type },
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
        const geneMatch = {};
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
              main: { key: endpoint },
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
  }
}

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
  (state) => state.settings.api,
  (state) => state.customLocation.description.search.value,
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
  (state) => state.settings.api,
  (state) => state.customLocation.description.search.value,
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
})(loadData(getSearchStringUrl)(ExactMatch));
