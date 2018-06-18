// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const INTERPRO_ACCESSION_PADDING = 6;

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
      <div className={f('callout', 'info')}>
        <span>Found an exact match: </span>
        <Link to={to}>{children}</Link>
      </div>
    );
  }
}

const XREFS = new Map([
  ['UNIPROT', { type: 'protein', db: 'UniProt' }],
  ['PDB', { type: 'structure', db: 'PDB' }],
  ['PROTEOME', { type: 'proteome', db: 'UniProt' }],
]);

/*:: type SMProps = {
  data: {
    payload: Object,
  },
  searchValue: ?string,
} */
class ExactMatch extends PureComponent /*:: <SMProps> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }),
    searchValue: T.string,
  };

  render() {
    const {
      searchValue,
      data: { payload },
    } = this.props;
    if (!searchValue || !payload || !payload.entries) return null;
    const searchRE = new RegExp(
      `^(${searchValue}|IPR${searchValue.padStart(
        INTERPRO_ACCESSION_PADDING,
        '0',
      )})$`,
      'i',
    );
    const exactMatches = new Map();
    for (const {
      id: accession,
      fields: {
        source_database: [db],
      },
    } of payload.entries) {
      if (searchRE.test(accession)) {
        exactMatches.set(
          'entry',
          <ExactMatchWrapper
            key="entry"
            to={{
              description: {
                main: { key: 'entry' },
                entry: { db, accession },
              },
            }}
          >
            entry {accession}
          </ExactMatchWrapper>,
        );
        break;
      }
    }
    for (const datum of payload.entries) {
      for (const [key, { type, db }] of XREFS.entries()) {
        if (exactMatches.has(type)) continue;
        for (const accession of datum.fields[key]) {
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
            break;
          }
        }
      }
    }
    if (!exactMatches.size) return null;
    return Array.from(exactMatches.values());
  }
}

const getQueryTerm = createSelector(
  query => query,
  query => {
    const number = +query;
    if (!Number.isInteger(number)) return query;
    const stringified = number.toString();
    if (stringified.length > INTERPRO_ACCESSION_PADDING) return query;
    return `IPR${stringified.padStart(
      INTERPRO_ACCESSION_PADDING,
      '0',
    )} OR ${query}`;
  },
);

const getEbiSearchUrl = createSelector(
  state => state.settings.ebi,
  state => state.customLocation.description.search.value,
  ({ protocol, hostname, port, root }, searchValue) => {
    if (!searchValue) return null;
    const fields = 'UNIPROT,PDB,PROTEOME,source_database';
    const query = getQueryTerm(searchValue);
    const params = `?query=${query}&format=json&fields=${fields}&start=0&size=2`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default loadData(getEbiSearchUrl)(ExactMatch);
