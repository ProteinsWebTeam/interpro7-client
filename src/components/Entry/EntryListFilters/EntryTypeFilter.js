import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

const allRE = /^all$/i;
const isAll = string => allRE.test(string);

class EntryTypeFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.shape({
        entry: T.shape({
          db: T.string.isRequired,
        }).isRequired,
      }).isRequired,
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
    const { page, type, ...search } = this.props.customLocation.search;
    if (!isAll(value)) search.type = value;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { description: { entry: { db } }, search },
    } = this.props;
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
                value={type.toLowerCase()}
                onChange={this._handleSelection}
                checked={
                  (!search.type && isAll(type)) ||
                  search.type === type.toLowerCase()
                }
                style={{ margin: '0.25em' }}
              />
              {isAll(type) || db !== 'InterPro' ? (
                type.replace('_', ' ')
              ) : (
                <interpro-type
                  type={type.replace('_', ' ')}
                  expanded
                  size="17px"
                >
                  {type}
                </interpro-type>
              )}
              <NumberLabel
                value={count}
                loading={loading}
                className={f('filter-label')}
              />
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
    const { type, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'type';
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
  })(EntryTypeFilter),
);
