import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';
import stylego from 'pages/style.css';

const f = foundationPartial(stylego, style);

const categories = {
  'Biological Process': 'P',
  'Cellular Component': 'C',
  'Molecular Function': 'F',
};

/* :: type Props = {
  data: {
    loading: boolean,
    payload: any,
  },
  isStale: boolean,
  goToCustomLocation: function,
  customLocation: {
    search: Object,
  }
}; */

class GOTermsFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const {
      page,
      go_category: _,
      cursor: __,
      ...search
    } = this.props.customLocation.search;
    if (value !== 'All') search.go_category = value;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      isStale,
      customLocation: { search },
    } = this.props;

    const terms = Object.entries(
      getPayloadOrEmpty(payload, loading, isStale),
    ).sort(([, a], [, b]) => b - a);
    if (!loading) {
      terms.unshift(['All', NaN]);
    }
    return (
      <div className={f('list-go', { stale: isStale })}>
        <div className={f('column')}>
          {terms.map(([term, count]) => {
            const checked =
              (term === 'All' && !search.go_category) ||
              search.go_category === categories[term];
            return (
              <label key={term} className={f('radio-btn-label', { checked })}>
                <input
                  type="radio"
                  name="go_category"
                  className={f('radio-btn')}
                  value={categories[term] || 'All'}
                  disabled={isStale}
                  onChange={this._handleSelection}
                  checked={checked}
                  style={{ margin: '0.25em' }}
                />
                <span>{term}</span>

                {term === 'Biological Process' ? (
                  <Tooltip title="Biological process category">
                    <small
                      className={f(
                        'margin-left-medium',
                        'sign-label-head',
                        'bp',
                      )}
                    >
                      BP
                    </small>
                  </Tooltip>
                ) : (
                  ''
                )}

                {term === 'Molecular Function' ? (
                  <Tooltip title="Molecular function category">
                    <small
                      className={f(
                        'small',
                        'margin-left-medium',
                        'sign-label-head',
                        'mf',
                      )}
                    >
                      MF
                    </small>
                  </Tooltip>
                ) : (
                  ''
                )}

                {term === 'Cellular Component' ? (
                  <Tooltip title="Cellular component category">
                    <small
                      className={f(
                        'small',
                        'margin-left-medium',
                        'sign-label-head',
                        'cc',
                      )}
                    >
                      CC
                    </small>
                  </Tooltip>
                ) : (
                  ''
                )}

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
            );
          })}
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const {
      // eslint-disable-next-line camelcase
      page_size,
      search: _,
      cursor: __,
      // eslint-disable-next-line camelcase
      go_category,
      ..._search
    } = search;
    // add to search
    _search.group_by = 'go_categories';
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
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(GOTermsFilter);
