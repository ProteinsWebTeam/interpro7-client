// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

const labels = new Map([
  ['true', 'With Matches'],
  ['false', 'Without Matches'],
  ['both', 'All proteins'],
]);

/*:: type Props = {
  data: {
    loading: boolean,
    payload: any
  },
  isStale: boolean,
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object
  }
}; */

class MatchPresenceFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const { goToCustomLocation, customLocation } = this.props;
    const {
      page,
      match_presence: _,
      cursor,
      ...search
    } = customLocation.search;
    if (labels.has(value) && value.toLowerCase() !== 'both')
      search.match_presence = value;
    goToCustomLocation({ ...customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      isStale,
      customLocation: { search },
    } = this.props;
    const hasMatches = getPayloadOrEmpty(
      // eslint-disable-next-line camelcase
      payload?.match_presence,
      loading,
      isStale,
    );
    if (!loading) {
      hasMatches.both = hasMatches.true + hasMatches.false;
    }
    const selectedValue = search.match_presence || 'both';

    return (
      <div className={f('list-match-presence', { stale: isStale })}>
        {Object.entries(hasMatches).map(([key, value]) => (
          <div key={key} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="match_presence_filter"
                value={key}
                disabled={isStale}
                checked={selectedValue === key}
                onChange={this._handleSelection}
                style={{ margin: '0.25em' }}
              />
              <span>{labels.get(key)}</span>
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
    // omit from search
    const { search: _, match_presence: __, cursor, ..._search } = search;
    // add to search
    _search.group_by = 'match_presence';
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
})(MatchPresenceFilter);
