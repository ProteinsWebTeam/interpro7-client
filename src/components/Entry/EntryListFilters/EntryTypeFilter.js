import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToCustomLocation } from 'actions/creators';
import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class EntryTypeFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    location: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  componentWillMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  _handleSelection = ({ target: { value } }) => {
    this.props.goToCustomLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        type: value === 'All' ? undefined : value,
        page: undefined,
      },
    });
  };

  render() {
    const { data: { loading, payload }, location: { search } } = this.props;
    const types = Object.entries(loading ? {} : payload).sort(
      ([, a], [, b]) => b - a,
    );
    if (!loading) {
      types.unshift(['All', types.reduce((acc, [, count]) => acc + count, 0)]);
    }
    return (
      <div className={f('list-entries')}>
        {types.map(([type, count]) => (
          <div key={type} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="entry_type"
                value={type}
                onChange={this._handleSelection}
                checked={
                  (!search.type && type === 'All') || search.type === type
                }
                style={{ margin: '0.25em ' }}
              />
              {type === 'All' ? (
                type
              ) : (
                <interpro-type
                  type={type.replace('_', ' ')}
                  expanded
                  size="17px"
                >
                  {type}
                </interpro-type>
              )}
              <NumberLabel value={count} className={f('filter-label')} />
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'type';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData({
    getUrl: getUrlFor,
  })(EntryTypeFilter),
);
