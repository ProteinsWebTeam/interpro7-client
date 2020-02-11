import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
// import MemberDBSelector from 'components/MemberDBSelector';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

const f = foundationPartial(style);

/* :: type Props = {
  data: {
    loading: boolean,
    payload: any,
  },
  dataMeta: {
    loading: boolean,
    payload: any,
  },
  goToCustomLocation: function,
  customLocation: {
    search: Object,
  }
}; */
class SignaturesFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    dataMeta: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const {
      page,
      signature_in: _,
      cursor: __,
      ...search
    } = this.props.customLocation.search;
    if (value !== 'All') search.signature_in = value;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  getDBName(db) {
    const metaDB =
      this.props.dataMeta.loading || !this.props.dataMeta.payload
        ? {}
        : this.props.dataMeta.payload.databases;
    return (metaDB[db] && metaDB[db].name) || db;
  }
  render() {
    const {
      data: { loading, payload },
      isStale,
      customLocation: {
        search: { signature_in: signature },
      },
    } = this.props;
    let _payload = payload;
    if (payload && loading && !isStale) _payload = {};
    if (!payload) _payload = {};

    const signatureDBs = Object.entries(_payload)
      .sort(([, a], [, b]) => b - a)
      .filter(s => {
        const text = s[0].toLowerCase();
        return text !== 'interpro' && text !== 'mobidblt';
      });
    if (!loading) {
      signatureDBs.unshift(['All', NaN]);
    }
    return (
      <div className={f('list-sign', { stale: isStale })}>
        {signatureDBs.map(([signatureDB, count]) => (
          <div key={signatureDB} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="interpro_state"
                value={signatureDB}
                onChange={this._handleSelection}
                disabled={isStale}
                checked={
                  (signatureDB === 'All' && !signature) ||
                  signature === signatureDB
                }
                style={{ margin: '0.25em' }}
              />
              <span>{this.getDBName(signatureDB)}</span>
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberComponent
                  label
                  loading={loading}
                  className={f('filter-label')}
                  abbr
                >
                  {count}
                </NumberComponent>
              )}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const {
      // eslint-disable-next-line camelcase
      signature_in,
      search: _,
      cursor: __,
      // eslint-disable-next-line camelcase
      page_size,
      ..._search
    } = search;
    // add to search
    _search.group_by = 'member_databases';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(
  loadData({ getUrl: getUrlForMeta, propNamespace: 'Meta' })(SignaturesFilter),
);
