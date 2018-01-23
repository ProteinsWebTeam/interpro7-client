// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

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

  constructor() {
    super();
    this.state = { value: null };
  }

  componentWillMount() {
    this.locationToState(this.props.customLocation);
  }

  componentWillReceiveProps(nextProps) {
    this.locationToState(nextProps.customLocation);
  }

  locationToState(customLocation) {
    const { integration } = customLocation.description.entry;
    if (integration === 'unintegrated') {
      this.setState({ value: 'unintegrated' });
    } else if (integration === 'integrated') {
      this.setState({ value: 'integrated' });
    } else {
      this.setState({ value: 'both' });
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
    const { data: { loading, payload } } = this.props;
    const types = loading ? {} : payload;
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div>
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
                <NumberLabel value={types[type]} />
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
    const { entry: { integration, ...entry }, ..._description } = description;
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
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData({
    getUrl: getUrlFor,
  })(IntegratedFilter),
);
