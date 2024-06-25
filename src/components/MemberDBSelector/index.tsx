import React, { FormEvent, PureComponent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';
import { sleep } from 'timing-functions';
import { noop, get as _get } from 'lodash-es';

import config from 'config';
import { NOT_MEMBER_DBS } from 'menuConfig';

import NumberComponent from 'components/NumberComponent';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import cancelable from 'utils/cancelable';
import { toPlural } from 'utils/pages/toPlural';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

const defaultDBFor = new Map([
  ['protein', 'uniprot'],
  ['structure', 'pdb'],
  ['taxonomy', 'uniprot'],
  ['proteome', 'uniprot'],
  ['set', 'all'],
]);

const MIN_DELAY = 400;
// const DELAY = 1500;

const getStaticCountFor = (db: string, counts: Record<string, number>) => {
  return counts[db] || 0;
};

// eslint-disable-next-line
const getCountFor = (
  db: string,
  {
    dataDBCount,
    dataAllCount,
    dataSubPageCount,
  }: {
    dataDBCount?: RequestedData<ComposedCounterPayload>;
    dataAllCount?: RequestedData<CounterPayload>;
    dataSubPageCount?: RequestedData<MetadataPayload & CounterPayload>;
  },
  main: Endpoint,
  sub?: string | null,
  hasMoreThanOneFilter?: boolean,
) => {
  if (sub) {
    if (!dataSubPageCount) return;
    if (dataSubPageCount.loading) return 'loading';
    if (!dataSubPageCount.ok) return;
    switch (db) {
      case 'interpro':
        return _get(
          dataSubPageCount.payload!.entries,
          [
            'interpro',
            sub === 'entry' && !hasMoreThanOneFilter ? '' : toPlural(sub),
          ].filter(Boolean),
        );
      case 'all':
        return _get(
          dataSubPageCount.payload!.entries,
          ['all', sub === 'entry' ? '' : toPlural(sub)].filter(Boolean),
        );
      default:
        return _get(
          dataSubPageCount.payload!.entries.member_databases,
          [
            db.toLowerCase(),
            sub === 'entry' && !hasMoreThanOneFilter ? '' : toPlural(sub),
          ].filter(Boolean),
          0,
        );
    }
  } else {
    if (!dataDBCount || !dataAllCount) return;
    switch (db) {
      case 'interpro':
        if (dataDBCount.loading) return 'loading';
        if (!dataDBCount.ok) return;
        return _get(
          dataDBCount.payload!.entries,
          [
            'interpro',
            main === 'entry' && !hasMoreThanOneFilter ? '' : toPlural(main),
          ].filter(Boolean),
        );
      case 'all':
        if (dataAllCount.loading) return 'loading';
        if (!dataAllCount.ok) return;
        return _get(dataAllCount.payload, [
          toPlural(main),
          defaultDBFor.get(main) || '',
        ]);
      default:
        if (dataDBCount.loading) return 'loading';
        if (!dataDBCount.ok) return;
        return _get(
          dataDBCount.payload!.entries.member_databases,
          [
            db.toLowerCase(),
            main === 'entry' && !hasMoreThanOneFilter ? '' : toPlural(main),
          ].filter(Boolean),
          0,
        );
    }
  }
};

const comparisonFunction = (a: DBInfo, b: DBInfo) => {
  if (a.canonical < b.canonical) return -1;
  if (b.canonical < a.canonical) return 1;
  return 0;
};

type Props = {
  contentType: string;
  filterType?: string;
  customLocation?: InterProLocation;
  lowGraphics?: boolean;
  goToCustomLocation?: typeof goToCustomLocation;
  className?: string;
  isSelected?: (db: DBInfo) => boolean;
  onChange?: (event: FormEvent) => void;
  hideCounters?: boolean;
  dbCounters?: Record<string, number>;
  children?: (visible: boolean) => React.ReactNode;
};
interface LoadedProps
  extends Props,
    LoadDataProps<CounterPayload, 'AllCount'>,
    LoadDataProps<ComposedCounterPayload, 'DBCount'>,
    LoadDataProps<MetadataPayload & CounterPayload, 'SubPageCount'>,
    LoadDataProps<RootAPIPayload, 'DB'> {}

type State = {
  visible: boolean;
};
export class _MemberDBSelector extends PureComponent<LoadedProps, State> {
  _dbs: Map<string, DBInfo>;
  _exit?: {
    promise: Promise<unknown>;
    canceled: boolean;
    cancel(): void;
  };

  constructor(props: LoadedProps) {
    super(props);

    this.state = { visible: false };

    this._dbs = new Map();
    if (
      props.customLocation?.description.main.key !== 'entry' &&
      props.contentType !== 'entry'
    ) {
      this._dbs.set('all', {
        canonical: 'all',
        name: 'All',
        description: 'All',
        version: '',
        releaseDate: '',
        type: '',
      });
    }
  }

  _populateDBs = (databases?: RequestedData<RootAPIPayload>) => {
    if (databases?.payload && this._dbs.size <= 1) {
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

  _defaultHandleChange = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;
    if (!this.props.customLocation) return;
    const description: InterProPartialDescription = {
      ...this.props.customLocation.description,
    };
    if (value === 'all') {
      description.entry = {};
    } else {
      description.entry = {
        isFilter: description.main?.key !== 'entry',
        db: value,
      };
    }
    if (description.main?.key === 'protein') {
      description.protein!.db = 'uniprot';
    }
    if (description.taxonomy!.isFilter) description.taxonomy!.isFilter = false;
    // const { page, ...search } = this.props.customLocation.search;
    const { search } = this.props.customLocation.search;
    this.props.goToCustomLocation?.({
      ...this.props.customLocation,
      description,
      search: { search },
    });
  };

  _handleOpen = () => {
    this.setState({ visible: true });
  };

  _handleExit = (withDelay: boolean) => () => {
    if (!this.state.visible) return;
    this._exit = cancelable(
      sleep(withDelay ? MIN_DELAY : 0).then(() => {
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
    if (!customLocation) return null;
    const { visible } = this.state;
    const dbs = this._populateDBs(dataDB);
    if (dbs.size <= 1) return null;
    const main = customLocation.description.main.key as Endpoint;
    const subL =
      customLocation.description[main].accession &&
      Object.entries(customLocation.description).find(
        ([_, maybeEndpointLocation]) =>
          !Array.isArray(maybeEndpointLocation) &&
          (maybeEndpointLocation as EndpointPartialLocation).isFilter,
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
        ([_, maybeEndpointLocation]) =>
          !Array.isArray(maybeEndpointLocation) &&
          (maybeEndpointLocation as EndpointPartialLocation).isFilter,
      ).length > 1;

    const shouldShowInterPro = customLocation.description.main.key !== 'entry';
    return (
      <div
        tabIndex={0}
        role="button"
        onMouseOver={() =>
          this._exit && !this._exit.canceled && this._exit.cancel()
        }
        onClick={this._handleOpen}
        onKeyPress={this._handleOpen}
        onFocus={this._handleOpen}
        onMouseLeave={this._handleExit(true)}
        onBlur={this._handleExit(true)}
        className={css('container', className, {
          lowGraphics,
        })}
      >
        <span
          className={css('child-container')}
          onClick={this._handleExit(false)}
          onKeyPress={this._handleExit(false)}
          role="button"
          tabIndex={0}
        >
          {children ? children(visible) : null}
        </span>
        <div className={css('potential-popup', { popup: children, visible })}>
          <div className={css('filter-label')}>
            <TooltipAndRTDLink rtdPage="searchways.html#using-browse-feature-to-search-and-filter-interpro" />{' '}
            Select your database:
          </div>
          <form
            className={css('db-selector', { 'one-column': !children })}
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
                    className={css('db-choice', { disabled, checked })}
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
                    <span className={css('text')}>
                      {db.name === 'All' ? `All ${toPlural(main)}` : db.name}
                    </span>
                    {!this.props.hideCounters && (
                      <NumberComponent
                        label
                        loading={loading}
                        className={css('label')}
                        titleType={toPlural(
                          main,
                          (!loading && (count as number)) || 0,
                        )}
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
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.main.key,
  ({ protocol, hostname, port, root }, mainType) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/${mainType}`,
    }),
);

const getUrlForMemberDBCount = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    let output = format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    });
    if (description.main.key && description.main.key !== 'entry') {
      output += `/${description.main.key}/${
        description[description.main.key as Endpoint].db
      }`;
      if (description.main.key === 'protein') {
        output = output.replace(/(un)?reviewed/i, 'UniProt');
      }
    }
    return output;
  },
);

const getUrlForSubPageCount = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const _description: InterProPartialDescription = { ...description };
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
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.ui.lowGraphics,
  (customLocation, lowGraphics) => ({ customLocation, lowGraphics }),
);

const FullyLoadedMemberDBSelector = loadData<RootAPIPayload, 'DB'>({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
})(
  loadData<CounterPayload, 'AllCount'>({
    getUrl: getUrlForAllCount,
    propNamespace: 'AllCount',
  } as LoadDataParameters)(
    loadData<ComposedCounterPayload, 'DBCount'>({
      getUrl: getUrlForMemberDBCount,
      propNamespace: 'DBCount',
    } as LoadDataParameters)(
      loadData<MetadataPayload & CounterPayload, 'SubPageCount'>({
        getUrl: getUrlForSubPageCount,
        propNamespace: 'SubPageCount',
        mapStateToProps,
        mapDispatchToProps: { goToCustomLocation },
      } as LoadDataParameters)(_MemberDBSelector),
    ),
  ),
);

const SimplyLoadedMemberDBSelector = loadData<RootAPIPayload, 'DB'>({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(_MemberDBSelector);

const OptMemberDBSelector = (props: Props) =>
  props.dbCounters ? (
    <SimplyLoadedMemberDBSelector {...props} />
  ) : (
    <FullyLoadedMemberDBSelector {...props} />
  );

export default OptMemberDBSelector;
