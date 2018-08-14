import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class IntegratedFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object,
    }).isRequired,
  };

  constructor(props) {
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
    const { goToCustomLocation, customLocation } = this.props;
    goToCustomLocation({
      ...customLocation,
      description: {
        ...customLocation.description,
        entry: {
          ...customLocation.description.entry,
          integration: value === 'both' ? null : value,
        },
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
    } = this.props;
    const types = loading ? {} : payload;
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div className={f('list-integrated')}>
        {Object.keys(types)
          .sort()
          .map(type => (
            <div key={type} className={f('column')}>
              <label className={f('row', 'filter-button')}>
                <input
                  type="radio"
                  name="interpro_state"
                  value={type}
                  onChange={this._handleSelection}
                  checked={this.state.value === type}
                  style={{ margin: '0.25em' }}
                />
                <span style={{ textTransform: 'capitalize' }}>{type}</span>
                <NumberLabel value={types[type]} loading={loading} abbr />
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
    const { search: _, ..._search } = search;
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
