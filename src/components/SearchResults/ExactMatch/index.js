import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import { proteinAccessionHandler } from 'utils/processDescription/handlers';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

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

const XREFS = new Map([
  ['UNIPROT', { type: 'protein', db: 'UniProt' }],
  ['PDB', { type: 'structure', db: 'PDB' }],
  ['PROTEOMES', { type: 'proteome', db: 'UniProt' }],
]);

const _ExactMatchProteinID = ({ data, identifier, type }) => {
  if (!data || data.loading || !data.payload || !data.payload.metadata)
    return null;
  const { db, accession } = data.payload.metadata;
  return (
    <ExactMatchWrapper
      key={type}
      to={{
        description: {
          main: { key: type },
          [type]: { db, accession },
        },
      }}
    >
      {type} {accession} [ID: {identifier}]
    </ExactMatchWrapper>
  );
};
_ExactMatchProteinID.propTypes = {
  data: dataPropType,
  identifier: T.string,
  type: T.string,
};
const getProteinIDUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.search.value,
  ({ protocol, hostname, port, root }, searchValue) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/protein/UniProt/${searchValue}`,
    }),
);

const ExactMatchProteinID = loadData({
  getUrl: getProteinIDUrl,
  // fetchOptions: { method: 'HEAD' },
})(_ExactMatchProteinID);

/*:: type SMProps = {
  data: {
    payload: Object,
  },
  searchValue: ?string,
} */
export class ExactMatch extends PureComponent /*:: <SMProps> */ {
  static propTypes = {
    data: dataPropType,
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
            // eslint-disable-next-line max-depth
            if (
              type === 'protein' &&
              !accession.match(proteinAccessionHandler.regexp)
            ) {
              exactMatches.set(
                type,
                <ExactMatchProteinID
                  key={type}
                  type={type}
                  identifier={accession}
                />,
              );
            } else {
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
    const fields = 'UNIPROT,PDB,PROTEOMES,source_database';
    const query = getQueryTerm(searchValue);
    const params = `?query=${query}&format=json&fields=${fields}&start=0&size=2`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default loadData(getEbiSearchUrl)(ExactMatch);
