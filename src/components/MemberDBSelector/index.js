import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';
import { sleep } from 'timing-functions';
import { noop, get as _get } from 'lodash-es';

import config from 'config';

import NumberComponent from 'components/NumberComponent';
// $FlowFixMe
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from '../../higherOrder/loadData/defaults';

import cancelable from 'utils/cancelable';
import { toPlural } from 'utils/pages';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import { NOT_MEMBER_DBS } from 'menuConfig';

import styles from './style.css';

const f = foundationPartial(styles);

const defaultDBFor = new Map([
  ['protein', 'uniprot'],
  ['structure', 'pdb'],
  ['taxonomy', 'uniprot'],
  ['proteome', 'uniprot'],
  ['set', 'all'],
]);

const MIN_DELAY = 400;
// const DELAY = 1500;

const getStaticCountFor = (db, counts) => {
  return counts[db] || 0;
};

// eslint-disable-next-line
const getCountFor = (
  db,
  { dataDBCount, dataAllCount, dataSubPageCount },
  main,
  sub,
  hasMoreThanOneFilter,
) => {
  if (sub) {
    if (dataSubPageCount.loading) return 'loading';
    if (!dataSubPageCount.ok) return;
    switch (db) {
      case 'interpro':
        return _get(
          dataSubPageCount.payload.entries,
          [
            'interpro',
            sub === 'entry' && !hasMoreThanOneFilter ? null : toPlural(sub),
          ].filter(Boolean),
        );
      case 'all':
        return _get(
          dataSubPageCount.payload.entries,
          ['all', sub === 'entry' ? null : toPlural(sub)].filter(Boolean),
        );
      default:
        return _get(
          dataSubPageCount.payload.entries.member_databases,
          [
            db.toLowerCase(),
            sub === 'entry' && !hasMoreThanOneFilter ? null : toPlural(sub),
          ].filter(Boolean),
          0,
        );
    }
  } else {
    switch (db) {
      case 'interpro':
        if (dataDBCount.loading) return 'loading';
        if (!dataDBCount.ok) return;
        return _get(
          dataDBCount.payload.entries,
          [
            'interpro',
            main === 'entry' && !hasMoreThanOneFilter ? null : toPlural(main),
          ].filter(Boolean),
        );
      case 'all':
        if (dataAllCount.loading) return 'loading';
        if (!dataAllCount.ok) return;
        return _get(dataAllCount.payload, [
          toPlural(main),
          defaultDBFor.get(main),
        ]);
      default:
        if (dataDBCount.loading) return 'loading';
        if (!dataDBCount.ok) return;
        return _get(
          dataDBCount.payload.entries.member_databases,
          [
            db.toLowerCase(),
            main === 'entry' && !hasMoreThanOneFilter ? null : toPlural(main),
          ].filter(Boolean),
          0,
        );
    }
  }
};

const comparisonFunction = (a, b) => {
  if (a.canonical < b.canonical) return -1;
  if (b.canonical < a.canonical) return 1;
  return 0;
};

const dataType = T.shape({
  loading: T.bool.isRequired,
  payload: T.object,
});

/*:: type Props = {
  children?: function,
  dataDB: {
    loading: boolean,
    payload: Object
   },
   dataAllCount?: {
    loading: boolean,
    payload: Object
   },
   dataDBCount: {
    loading: boolean,
    payload: Object
   },
   dataSubPageCount?: {
    loading: boolean,
    payload: Object
   },
   contentType: string,
   filterType?: string,
   customLocation: {
     description: Object,
     search: Object
   },
   lowGraphics: boolean,
   goToCustomLocation: function,
   className?: string,
   isSelected?: function,
   onChange?: function,
   hideCounters?: boolean,
   dbCounters?: Object
}; */

/*:: type State = {
  visible: boolean
}; */
export class _MemberDBSelector extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    children: T.func,
    dataDB: dataType,
    dataAllCount: dataType,
    dataDBCount: dataType,
    dataSubPageCount: dataType,
    contentType: T.string.isRequired,
    filterType: T.string,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    lowGraphics: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
    className: T.string,
    isSelected: T.func,
    onChange: T.func,
    hideCounters: T.bool,
    dbCounters: T.object,
  };

  constructor(props /*: Props */) {
    /* _dbs : Map<string, Object> */
    super(props);

    this.state = { visible: false };

    this._dbs = new Map();
    if (
      props.customLocation.description.main.key !== 'entry' &&
      props.contentType !== 'entry'
    ) {
      this._dbs.set('all', { canonical: 'all', name: 'All' });
    }
  }

  componentWillUnmount() {
    if (this._hide) this._hide.cancel();
  }

  _populateDBs = (databases) => {
    if (databases.payload && this._dbs.size <= 1) {
      this._dbs.set('interpro', databases.payload.databases.interpro);
      const dbs = Object.values(databases.payload.databases).sort(
        comparisonFunction,
      );
      for (const db of dbs) {
        if (
          db.type === 'entry' &&
          db.canonical !== 'interpro' &&
          !NOT_MEMBER_DBS.has(db.canonical)
        ) {
          this._dbs.set(db.canonical, db);
        }
      }
    }
    return this._dbs;
  };

  _defaultHandleChange = ({ target: { value } }) => {
    const description = { ...this.props.customLocation.description };
    if (value === 'all') {
      description.entry = {};
    } else {
      description.entry = {
        isFilter: description.main.key !== 'entry',
        db: value,
      };
    }
    if (description.main.key === 'protein') {
      description.protein.db = 'uniprot';
    }
    if (description.taxonomy.isFilter) description.taxonomy.isFilter = false;
    // const { page, ...search } = this.props.customLocation.search;
    const { search } = this.props.customLocation.search;
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description,
      search: { search },
    });
    // this._handleExit(DELAY);
    /* TODO: if we decide to not close after click on database, remove this, and
       logic to handle delay in this._handleExit */
  };

  _handleOpen = () => {
    if (this._hide) this._hide.cancel();
    this.setState({ visible: true });
  };

  _handleExit =
    (withDelay /*: boolean*/) => (maybeEvent /*: Event | number */) => {
      if (!this.state.visible) return;
      const delay = Number.isFinite(maybeEvent) ? maybeEvent : MIN_DELAY;
      this._exit = cancelable(
        sleep(withDelay ? delay : 0).then(() => {
          if (this._exit && !this._exit.canceled) {
            this.setState({ visible: false });
          }
        }),
      );
      this._exit.promise.catch(noop);
    };

  render() {
    const {
      children,
      dataDB,
      dataDBCount,
      dataAllCount,
      dataSubPageCount,
      customLocation,
      lowGraphics,
      className = '',
      dbCounters,
    } = this.props;
    const { visible } = this.state;
    const dbs = this._populateDBs(dataDB);
    if (dbs.size <= 1) return null;
    const main = customLocation.description.main.key;
    const subL =
      customLocation.description[main].accession &&
      Object.entries(customLocation.description).find(
        ([_, { isFilter }]) => isFilter,
      );
    const sub = this.props.filterType || (subL && subL[0]);
    const isSelected =
      this.props.isSelected ||
      ((db) =>
        (customLocation.description.entry.db || 'all').toLowerCase() ===
        db.canonical.toLowerCase());
    const selected = Array.from(this._dbs.values()).find(isSelected);
    const handleChange = this.props.onChange || this._defaultHandleChange;
    const hasMoreThanOneFilter =
      Object.entries(customLocation.description).filter(
        ([_, { isFilter }]) => isFilter,
      ).length > 1;

    const shouldShowInterPro = customLocation.description.main.key !== 'entry';
    return (
      <div
        tabIndex="0"
        role="button"
        onMouseOver={() =>
          this._exit && !this._exit.canceled && this._exit.cancel()
        }
        onClick={this._handleOpen}
        onKeyPress={this._handleOpen}
        onFocus={this._handleOpen}
        onMouseLeave={this._handleExit(true)}
        onBlur={this._handleExit(true)}
        className={f('container', className, {
          lowGraphics,
        })}
      >
        <span
          className={f('child-container')}
          onClick={this._handleExit(false)}
          onKeyPress={this._handleExit(false)}
          role="button"
          tabIndex="0"
        >
          {children ? children(visible) : null}
        </span>
        <div className={f('potential-popup', { popup: children, visible })}>
          <div className={f('filter-label')}>
            <TooltipAndRTDLink rtdPage="searchways.html#using-browse-feature-to-search-and-filter-interpro" />{' '}
            Select your database:
          </div>
          <form
            className={f('db-selector', { 'one-column': !children })}
            onChange={handleChange}
          >
            {Array.from(this._dbs.values())
              .filter(({ canonical }) =>
                canonical === 'interpro' ? shouldShowInterPro : true,
              )
              .map((db) => {
                const count = dbCounters
                  ? getStaticCountFor(db.canonical, dbCounters)
                  : getCountFor(
                      db.canonical,
                      { dataDBCount, dataAllCount, dataSubPageCount },
                      main,
                      sub,
                      hasMoreThanOneFilter,
                    );
                const disabled = count === 0;
                const loading = count === 'loading';
                const checked = db === selected;
                return (
                  <label
                    key={db.canonical}
                    className={f('db-choice', { disabled, checked })}
                    style={{ color: config.colors.get(db.canonical) }}
                    data-testid={`memberdb-filter-${db.canonical
                      .toLowerCase()
                      .replace(/\s+/, '_')}`}
                  >
                    <input
                      type="radio"
                      name="db-radio"
                      value={db.canonical}
                      disabled={disabled}
                      checked={checked}
                      onChange={noop}
                    />
                    <span className={f('text')}>
                      {db.name === 'All' ? `All ${toPlural(main)}` : db.name}
                    </span>
                    {!this.props.hideCounters && (
                      <NumberComponent
                        loading={loading}
                        className={f('label')}
                        titleType={toPlural(main, (!loading && count) || 0)}
                        style={{
                          background:
                            checked && config.colors.get(db.canonical),
                        }}
                        abbr
                      >
                        {(!loading && count) || 0}
                      </NumberComponent>
                    )}
                  </label>
                );
              })}
          </form>
        </div>
      </div>
    );
  }
}

const getUrlForAllCount = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.main.key,
  ({ protocol, hostname, port, root }, mainType) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/${mainType}`,
    }),
);

const getUrlForMemberDBCount = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    let output = format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    });
    if (description.main.key && description.main.key !== 'entry') {
      output += `/${description.main.key}/${
        description[description.main.key].proteomeDB ||
        description[description.main.key].db
      }`;
      if (description.main.key === 'protein') {
        output = output.replace(/(un)?reviewed/i, 'UniProt');
      }
    }
    return output;
  },
);

const getUrlForSubPageCount = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const { ..._description } = description;
    if (description.main.key !== 'entry') {
      _description.entry = { isFilter: true };
    }
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
    });
  },
);

const mapStateToProps = createSelector(
  customLocationSelector,
  (state) => state.settings.ui.lowGraphics,
  (customLocation, lowGraphics) => ({ customLocation, lowGraphics }),
);

const FullyLoadedMemberDBSelector = loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
})(
  loadData({ getUrl: getUrlForAllCount, propNamespace: 'AllCount' })(
    loadData({ getUrl: getUrlForMemberDBCount, propNamespace: 'DBCount' })(
      loadData({
        getUrl: getUrlForSubPageCount,
        propNamespace: 'SubPageCount',
        mapStateToProps,
        mapDispatchToProps: { goToCustomLocation },
      })(_MemberDBSelector),
    ),
  ),
);

const SimplyLoadedMemberDBSelector = loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(_MemberDBSelector);

const OptMemberDBSelector = (props) =>
  props.dbCounters ? (
    <SimplyLoadedMemberDBSelector {...props} />
  ) : (
    <FullyLoadedMemberDBSelector {...props} />
  );
OptMemberDBSelector.propTypes = {
  dbCounters: T.object,
};

export default OptMemberDBSelector;
