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

/*:: type SMWProps = {
  to: Object,
  children: any,
  autoRedirect: boolean,
}; */
/*:: type SMWState = {|
  triggerRedirect: boolean,
|}; */
class _SingleMatchWrapper extends PureComponent /*:: <SMWProps, SMWState> */ {
  /*::
    _trigger: cancelable;
  */
  static propTypes = {
    to: T.object.isRequired,
    children: T.any.isRequired,
    autoRedirect: T.bool.isRequired,
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
    const { to, children } = this.props;
    const LinkOrRedirect = this.state.triggerRedirect ? Redirect : Link;
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

const SingleMatchWrapper = connect(mapStateToProps)(_SingleMatchWrapper);

/*:: type SMProps = {
  data: {
    payload: Object,
  },
  searchValue: ?string,
} */
class SingleMatch extends PureComponent /*:: <SMProps> */ {
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
    for (const {
      id: accession,
      fields: {
        source_database: [db],
      },
    } of payload.entries) {
      if (searchRE.test(accession)) {
        return (
          <SingleMatchWrapper
            to={{
              description: {
                main: { key: 'entry' },
                entry: { db, accession },
              },
            }}
          >
            Entry {accession}
          </SingleMatchWrapper>
        );
      }
    }
    for (const accession of payload.entries[0].fields.PDB) {
      if (searchRE.test(accession)) {
        return (
          <SingleMatchWrapper
            to={{
              description: {
                main: { key: 'structure' },
                structure: { db: 'PDB', accession },
              },
            }}
          >
            Structure {accession}
          </SingleMatchWrapper>
        );
      }
    }
    for (const accession of payload.entries[0].fields.UNIPROT) {
      if (searchRE.test(accession)) {
        return (
          <SingleMatchWrapper
            to={{
              description: {
                main: { key: 'protein' },
                protein: { db: 'UniProt', accession },
              },
            }}
          >
            Protein {accession}
          </SingleMatchWrapper>
        );
      }
    }
    return null;
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
  state => state.settings.navigation.pageSize,
  state => state.customLocation.search,
  state => state.customLocation.description.search.value,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    search,
    searchValue,
  ) => {
    if (!searchValue) return null;
    const fields = 'PDB,UNIPROT,description,source_database';
    const size = search.page_size || settingsPageSize;
    const query = getQueryTerm(searchValue);
    const params = `?query=${query}&format=json&fields=${fields}&start=0&size=${size}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default loadData(getEbiSearchUrl)(SingleMatch);
