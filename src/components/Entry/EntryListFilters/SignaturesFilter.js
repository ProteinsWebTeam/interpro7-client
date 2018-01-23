// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class SignaturesFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const { page, signature_in, ...search } = this.props.customLocation.search;
    if (value !== 'All') search.signature_in = value;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { search: { signature_in: signature } },
    } = this.props;
    const signatureDBs = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a)
      .filter(s => {
        const text = s[0].toLowerCase();
        return text !== 'interpro' && text !== 'mobidblt';
      });
    if (!loading) {
      signatureDBs.unshift(['All', NaN]);
    }
    return (
      <div className={f('list-sign')}>
        {signatureDBs.map(([signatureDB, count]) => (
          <div key={signatureDB} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="interpro_state"
                value={signatureDB}
                onChange={this._handleSelection}
                checked={
                  (signatureDB === 'All' && !signature) ||
                  signature === signatureDB
                }
                style={{ margin: '0.25em' }}
              />
              <span>{signatureDB}</span>
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberLabel value={count} className={f('filter-label')} />
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
    // eslint-disable-next-line camelcase
    const { signature_in, search: _, page_size, ..._search } = search;
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
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData({
    getUrl: getUrlFor,
  })(SignaturesFilter),
);
