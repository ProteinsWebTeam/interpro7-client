// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

/* :: type Props = {
  data: {
    loading: boolean,
    payload: any,
  },
  isStale: boolean,
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object,
  }
}; */

/* :: type State = {
  value: ?string
}; */

class IntegratedFilter extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object,
      search: T.object,
    }).isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = { value: null };
  }

  static getDerivedStateFromProps({ customLocation }) {
    const { integration: value } = customLocation.description.entry;
    switch (value) {
      case 'unintegrated':
      case 'integrated':
        return { value };
      default:
        return { value: 'both' };
    }
  }

  _handleSelection = ({ target: { value } }) => {
    this.setState({ value });
    const {
      goToCustomLocation,
      customLocation: { description, search: s, ...rest },
    } = this.props;
    const { cursor: _, ...search } = s;
    goToCustomLocation({
      ...rest,
      search,
      description: {
        ...description,
        entry: {
          ...description.entry,
          integration: value === 'both' ? null : value,
        },
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
      isStale,
    } = this.props;
    const types = getPayloadOrEmpty(payload, loading, isStale);
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div className={f('list-integrated', { stale: isStale })}>
        {Object.keys(types)
          .sort()
          .map(type => (
            <div key={type} className={f('column')}>
              <label className={f('row', 'filter-button')}>
                <input
                  type="radio"
                  name="interpro_state"
                  value={type}
                  disabled={isStale}
                  onChange={this._handleSelection}
                  checked={this.state.value === type}
                  style={{ margin: '0.25em' }}
                />
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
                <NumberComponent label loading={loading} abbr>
                  {types[type]}
                </NumberComponent>
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
    // omit from description
    const {
      entry: { integration, ...entry },
      ..._description
    } = description;
    _description.entry = entry;
    // omit from search
    const { search: _, cursor: __, ..._search } = search;
    // add to search
    _search.interpro_status = null;
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
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(IntegratedFilter);
