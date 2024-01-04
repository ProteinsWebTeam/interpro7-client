import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import { Helmet } from 'react-helmet-async';

import { createSelector } from 'reselect';
import Link from 'components/generic/Link';

import ErrorBoundary, {
  UnconnectedErrorBoundary,
} from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import { mainDBLocationSelector } from 'reducers/custom-location/description';
import { getUrlForApi, getUrlForMeta } from 'higherOrder/loadData/defaults';
import loadData from 'higherOrder/loadData';
import { edgeCases } from 'utils/server-message';
import { toPlural } from 'utils/pages';

import Loading from 'components/SimpleCommonComponents/Loading';
import EntryMenu from 'components/EntryMenu';
import RemovedEntrySummary from 'components/Entry/RemovedEntrySummary';
import Title from 'components/Title';
import EdgeCase from 'components/EdgeCase';
import { getMessageIfLocationRemoved } from 'utils/removed-pages';

import {
  // schemaProcessDataRecord,
  schemaProcessMainEntity,
} from 'schema_org/processors';
import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import pageStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, fonts, pageStyle);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType.isRequired,
  subPagesForEndpoint: T.oneOfType([T.func, T.object]),
};

class SummaryComponent extends PureComponent {
  static propTypes = {
    data: dataPropType.isRequired,
    dataBase: dataPropType.isRequired,
    customLocation: T.object.isRequired,
    SummaryAsync: T.oneOfType([T.func, T.object]),
  };

  render() {
    const {
      data: { payload, loading },
      dataBase: { payload: payloadDB, loading: loadingDB },
      customLocation,
      SummaryAsync,
    } = this.props;
    const db =
      (!loadingDB &&
        payloadDB &&
        payloadDB.databases &&
        payloadDB.databases[customLocation.description.entry.db]) ||
      {};
    return (
      <SummaryAsync
        data={payload}
        dbInfo={db}
        customLocation={customLocation}
        loading={loading && loadingDB}
      />
    );
  }
}

const locationhasDetailOrFilter = (customLocation) => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].detail ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
};

const STATUS_GONE = 410;
class Summary extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { status, loading, payload },
      dataBase: { payload: payloadDB, loading: loadingDB },
      customLocation,
      subPagesForEndpoint,
    } = this.props;
    const {
      description: {
        main: { key: endpoint },
      },
    } = customLocation;

    if (loading) {
      return <Loading />;
    }

    if (payload && status === STATUS_GONE) {
      const db =
        (!loadingDB &&
          payloadDB &&
          payloadDB.databases &&
          payloadDB.databases[customLocation.description.entry.db]) ||
        {};

      return <RemovedEntrySummary {...payload} dbInfo={db} />;
    }

    const removedPageMesagge = getMessageIfLocationRemoved(
      customLocation.description,
    );
    if (removedPageMesagge) {
      return (
        <EdgeCase
          text={removedPageMesagge}
          status={410}
          shouldRedirect={false}
        />
      );
    }

    if (edgeCases.has(status)) {
      const edgeCaseText = edgeCases.get(status);
      if (edgeCaseText) {
        return <EdgeCase text={edgeCaseText} status={status} />;
      }
    }

    if (!locationhasDetailOrFilter(customLocation) && !payload) {
      return <Loading />;
    }

    return (
      <>
        {payload?.metadata?.accession && (
          <>
            {/* <SchemaOrgData
              data={{
                data: payload,
                endpoint,
                version: databases && databases.uniprot.version,
              }}
              processData={schemaProcessDataRecord}
            /> */}
            <SchemaOrgData
              data={{
                data: payload.metadata,
                type: endpoint,
              }}
              processData={schemaProcessMainEntity}
            />
          </>
        )}

        <div className={f('row')}>
          <div className={f('medium-12', 'large-12', 'columns')}>
            <UnconnectedErrorBoundary customLocation={customLocation}>
              {loading ? <Loading /> : null}
              {!loading && (!payload || !payload.metadata) ? null : (
                <Title metadata={payload.metadata} mainType={endpoint} />
              )}
            </UnconnectedErrorBoundary>
          </div>
        </div>
        <div className={f('row')}>
          <div className={f('medium-12', 'large-12', 'columns')}>
            <section className={f('menu-and-content')}>
              <nav>
                <UnconnectedErrorBoundary customLocation={customLocation}>
                  <EntryMenu metadata={payload.metadata} />
                </UnconnectedErrorBoundary>
              </nav>
              <section>
                <UnconnectedErrorBoundary customLocation={customLocation}>
                  <Switch
                    {...this.props}
                    locationSelector={locationhasDetailOrFilter}
                    indexRoute={SummaryComponent}
                    childRoutes={subPagesForEndpoint}
                  />
                </UnconnectedErrorBoundary>
              </section>
            </section>
          </div>
        </div>
      </>
    );
  }
}

class Overview extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload },
      customLocation: {
        description: {
          main: { key },
        },
      },
    } = this.props;
    const keyS = toPlural(key);
    const _payload = payload || {};
    return (
      <ul>
        {Object.entries(_payload[keyS] || {}).map(([name, count]) => (
          <li key={name}>
            <Link
              to={{
                description: {
                  main: { key },
                  [key]: { db: name },
                },
              }}
            >
              {name}
              {Number.isFinite(count) ? ` (${count})` : ''}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}

const locationHasAccessionOrFilters = (customLocation) => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].accession ||
    customLocation.description[key].memberDBAccession ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
};

// Keep outside! Otherwise will be redefined at each render of the outer Switch
class InnerSwitch extends PureComponent {
  static propTypes = {
    subpagesRoutes: T.object.isRequired,
    children: T.any,
    listOfEndpointEntities: T.func,
  };

  render() {
    const { subpagesRoutes, listOfEndpointEntities } = this.props;
    const childRoutes = new Map([[subpagesRoutes, Summary]]);
    return (
      <ErrorBoundary>
        <Switch
          {...this.props}
          locationSelector={locationHasAccessionOrFilters}
          indexRoute={listOfEndpointEntities}
          childRoutes={childRoutes}
          catchAll={listOfEndpointEntities}
        />
      </ErrorBoundary>
    );
  }
}

class EndPointPage extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
    children: T.any,
    mainEndpoint: T.object,
    hasFilters: T.bool,
  };

  render() {
    const { mainEndpoint, hasFilters, data } = this.props;
    // eslint-disable-next-line camelcase
    const db = data?.payload?.metadata?.source_database;
    const accession = data?.payload?.metadata?.accession;
    const hasCanonical =
      mainEndpoint.accession &&
      !mainEndpoint.detail &&
      !hasFilters &&
      mainEndpoint.db;
    return (
      <ErrorBoundary>
        <Helmet>
          <title>Browse</title>
          {hasCanonical && (
            <link
              rel="canonical"
              href={`https://www.ebi.ac.uk/interpro/${mainEndpoint.type}/${db}/${accession}`}
            />
          )}
        </Helmet>
        <Switch
          {...this.props}
          locationSelector={mainDBLocationSelector}
          indexRoute={Overview}
          catchAll={InnerSwitch}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key],
  (state) =>
    (
      Object.entries(state.customLocation.description || {}).find(
        ([_key, value]) => value.isFilter,
      ) || []
    ).length > 0,
  (key, mainEndpoint, hasFilters) => ({
    mainEndpoint: { ...mainEndpoint, type: key },
    hasFilters,
  }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
  mapStateToProps,
})(loadData(getUrlForApi)(EndPointPage));
