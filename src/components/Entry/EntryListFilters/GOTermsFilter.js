import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

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

class GOTermsFilter extends PureComponent {
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
    const {
      page,
      go_category: _,
      ...search
    } = this.props.customLocation.search;
    if (value !== 'All') search.go_category = value;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { search },
    } = this.props;
    const terms = Object.entries(loading ? {} : payload).sort(
      ([, a], [, b]) => b - a,
    );
    if (!loading) {
      terms.unshift(['All', NaN]);
    }
    return (
      <div className={f('list-go')}>
        {terms.map(([term, count]) => (
          <div key={term} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="go_category"
                value={categories[term] || 'All'}
                onChange={this._handleSelection}
                checked={
                  (term === 'All' && !search.go_category) ||
                  search.go_category === categories[term]
                }
                style={{ margin: '0.25em' }}
              />
              <span>{term}</span>

              {term === 'Biological Process' ? (
                <Tooltip title="Biological process category">
                  <small
                    className={f('margin-left-medium', 'sign-label-head', 'bp')}
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
    const { page_size, search: _, go_category, ..._search } = search;
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
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(GOTermsFilter);
