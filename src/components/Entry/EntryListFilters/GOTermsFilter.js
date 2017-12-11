import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

const categories = {
  'Biological Process': 'P',
  'Cellular Component': 'C',
  'Molecular Function': 'F',
};

class GOTermsFilter extends Component {
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
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: {
        ...this.props.customLocation.search,
        go_category: value === 'All' ? undefined : value,
        page: undefined,
      },
    });
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
    const { page_size, search: _, go_category, ..._search } = search;
    // add to search
    _search.group_by = 'go_categories';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${descriptionToPath(
      description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData({
    getUrl: getUrlFor,
  })(GOTermsFilter),
);
