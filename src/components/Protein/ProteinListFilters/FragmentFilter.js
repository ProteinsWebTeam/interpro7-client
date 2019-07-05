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

class FragmentFilter extends PureComponent {
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

  _handleSelection = ({ target: { value } }) => {
    const { page, ...search } = this.props.customLocation.search;
    const _search = { ...search, is_fragment: value };
    if (value === 'both') {
      delete _search.is_fragment;
    }
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description: {
        ...this.props.customLocation.description,
      },
      search: _search,
    });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { description, search },
    } = this.props;
    const groupsPayload = loading || !payload ? {} : payload.is_fragment;
    const groups = {
      true: groupsPayload.true || 0,
      false: groupsPayload.false || 0,
    };
    if (!loading) {
      groups.both = groups ? (groups.true || 0) + (groups.false || 0) : 0;
    }
    const currentValue = (search.is_fragment || 'both').toLowerCase();
    return (
      <div className={f('list-curation')}>
        {Object.entries(groups).map(([isFragment, value]) => (
          <div key={isFragment} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="fragment_filter"
                value={isFragment}
                onChange={this._handleSelection}
                checked={currentValue === isFragment}
                style={{ margin: '0.25em' }}
              />
              <span>{isFragment}</span>
              <NumberComponent
                label
                loading={loading}
                className={f('filter-label')}
                abbr
              >
                {value}
              </NumberComponent>
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
    const _description = {
      ...description,
      protein: { db: description.protein.db || 'UniProt' },
    };
    // For Subpages
    if (description.main.key !== 'protein') {
      _description.main = { key: 'protein' };
      _description[description.main.key] = {
        ...description[description.main.key],
        isFilter: true,
      };
    }

    // omit from search
    const { search: _, ..._search } = search;
    if ('is_fragment' in _search) delete _search.is_fragment;
    // add to search
    _search.group_by = 'is_fragment';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
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
})(FragmentFilter);
