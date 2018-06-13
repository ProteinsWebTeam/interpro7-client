// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { sleep } from 'timing-functions/src';

import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import loadData from 'higherOrder/loadData';

import cancelable from 'utils/cancelable';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const INTERPRO_ACCESSION_PADDING = 6;
const TOGGLE_DURATION = 500;

// TODO: review the whole logic for this file, especially, check if there is a
// TODO: way to be sure to have all the exact matches (in one go if possible)
// 1 -> entry IPR000001 AND taxid 1
// 9606 -> entry IPR09606 AND taxid 9606
// Only redirect, if activated, to the entry if there are multiple matches

/*:: type SMWProps = {
  to: Object,
  children: any,
  autoRedirect: boolean,
  absolutelyNoRedirect?: boolean,
}; */
/*:: type SMWState = {|
  triggerRedirect: boolean,
|}; */
class _ExactMatchWrapper extends PureComponent /*:: <SMWProps, SMWState> */ {
  /*::
    _trigger: cancelable;
  */
  static propTypes = {
    to: T.object.isRequired,
    children: T.any.isRequired,
    autoRedirect: T.bool.isRequired,
    absolutelyNoRedirect: T.bool,
  };

  constructor(props) {
    super(props);

    this.state = { triggerRedirect: props.autoRedirect };
  }

  componentDidUpdate() {
    if (this._trigger) this._trigger.cancel();
    this._trigger = cancelable(this._triggerRedirect());
  }

  componentWillUnmount() {
    if (this._trigger) this._trigger.cancel();
  }

  _triggerRedirect = async () => {
    await sleep(TOGGLE_DURATION);
    if (this._trigger.canceled) return;
    this.setState({ triggerRedirect: this.props.autoRedirect });
  };

  render() {
    const { to, children, absolutelyNoRedirect } = this.props;
    const LinkOrRedirect =
      absolutelyNoRedirect || !this.state.triggerRedirect ? Link : Redirect;
    return (
      <div className={f('callout', 'info')}>
        <span>Found an exact match: </span>
        <LinkOrRedirect to={to}>{children}</LinkOrRedirect>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.navigation.autoRedirect,
  autoRedirect => ({ autoRedirect }),
);

const ExactMatchWrapper = connect(mapStateToProps)(_ExactMatchWrapper);

const XREFS = new Map([
  ['UNIPROT', { type: 'protein', db: 'UniProt' }],
  ['PDB', { type: 'structure', db: 'PDB' }],
  ['TAXONOMY', { type: 'taxonomy', db: 'UniProt' }],
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
            const absolutelyNoRedirect = !!exactMatches.size;
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
                absolutelyNoRedirect={absolutelyNoRedirect}
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
    return Array.from(exactMatches.entries()).map(
      ([type, Component]) => Component,
    );
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
    const fields = 'UNIPROT,PDB,TAXONOMY,PROTEOME,source_database';
    const query = getQueryTerm(searchValue);
    const params = `?query=${query}&format=json&fields=${fields}&start=0&size=2`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default loadData(getEbiSearchUrl)(ExactMatch);
