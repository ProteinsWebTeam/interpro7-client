import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

/*:: type Props = {
  data: {
    loading: boolean,
    payload: any
  },
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object
  }
}; */
class SizeFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  handleSelection = ({ target: { value } }) => {
    const { page, size: _, ...search } = this.props.customLocation.search;
    if (value !== 'All') search.size = value;
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
      <div className={f('list-size')}>
        {terms.map(([term, count]) => (
          <div key={term} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="protein_size"
                value={term || 'All'}
                onChange={this.handleSelection}
                checked={
                  (term === 'All' && !search.size) || search.size === term
                }
                style={{ margin: '0.25em' }}
              />
              <span>{term}</span>
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

const getUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // transform description
    // omit from search
    const { search: _, size, ..._search } = search;
    // add to search
    _search.group_by = 'size';
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
  getUrl,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(SizeFilter);
