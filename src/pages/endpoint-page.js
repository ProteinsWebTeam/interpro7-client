import React, { PureComponent, Children, Fragment } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import { mainDBLocationSelector } from 'reducers/custom-location/description';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import loadData from 'higherOrder/loadData';
import { toPlural } from 'utils/pages';

import Loading from 'components/SimpleCommonComponents/Loading';
import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import { foundationPartial } from 'styles/foundation';

import pageStyle from './style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { createSelector } from 'reselect';
import {
  schemaProcessDataRecord,
  schemaProcessMainEntity,
} from 'schema_org/processors';
import loadable from 'higherOrder/loadable';

const f = foundationPartial(pageStyle, styles, fonts);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }).isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }),
};

class SummaryComponent extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.any,
    }).isRequired,
    customLocation: T.object.isRequired,
    SummaryAsync: T.func,
  };

  render() {
    const {
      data: { payload, loading },
      customLocation,
      SummaryAsync,
    } = this.props;
    return (
      <SummaryAsync
        data={payload}
        customLocation={customLocation}
        loading={loading}
      />
    );
  }
}

const locationhasDetailOrFilter = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].detail ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
}, value => value);

class Summary extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { loading, payload },
      // dataOrganism: { loading: loadingOrg, payload: payloadOrg },
      dataBase,
      customLocation: {
        description: {
          main: { key: endpoint },
        },
      },
      subPagesForEndpoint,
    } = this.props;
    if (loading || !payload) {
      return <Loading />;
    }
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    return (
      <Fragment>
        {payload &&
          payload.metadata &&
          payload.metadata.accession && (
            <Fragment>
              <SchemaOrgData
                data={{
                  data: payload,
                  endpoint,
                  version: databases && databases.uniprot.version,
                }}
                processData={schemaProcessDataRecord}
              />
              <SchemaOrgData
                data={{
                  data: payload.metadata,
                  type: endpoint,
                }}
                processData={schemaProcessMainEntity}
              />
            </Fragment>
          )}

        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('medium-12', 'large-12', 'columns')}>
              {loading ? (
                <Loading />
              ) : (
                <Title metadata={payload.metadata} mainType={endpoint} />
              )}
              <EntryMenu metadata={payload.metadata} />
            </div>
          </div>
          <Switch
            {...this.props}
            locationSelector={locationhasDetailOrFilter}
            indexRoute={SummaryComponent}
            childRoutes={subPagesForEndpoint}
          />
        </ErrorBoundary>
      </Fragment>
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
      <ul className={f('card')}>
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

const locationHasAccessionOrFilters = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].accession ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
}, value => value);

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
  };

  render() {
    return (
      <ErrorBoundary>
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

export default loadData({ getUrl: getUrlForMeta, propNamespace: 'Base' })(
  loadData()(EndPointPage),
);
