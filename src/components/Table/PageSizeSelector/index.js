/* eslint no-magic-numbers: [1, {ignore: [-1, 1, 10, 20, 50, 100]}] */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation, changePageSize } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import s from './style.css';

const f = foundationPartial(s);

const OPTIONS = [20, 50, 100];

const getPageSize = createSelector(
  props => props,
  props => props.customLocation.search.page_size || props.settingsPageSize,
);

class PageSizeSelector extends PureComponent {
  static propTypes = {
    customLocation: T.object.isRequired,
    pageSize: T.number,
    changePageSize: T.func,
    goToCustomLocation: T.func,
  };

  constructor(props) {
    super(props);
    const pageSize = props.customLocation.search.page_size
      ? props.customLocation.search.page_size
      : props.pageSize;
    this.state = { pageSize };
  }

  _handleChange = event => {
    this.setState({ pageSize: event.target.value });
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: {
        ...this.props.customLocation.search,
        page_size: event.target.value,
        page: 1,
      },
    });
  };

  render() {
    const options = Array.from(new Set([...OPTIONS, getPageSize(this.props)]))
      .filter(Boolean)
      .sort((a, b) => a - b);
    console.log(options);
    return (
      <div className={f('table-length')}>
        Show{' '}
        <select
          className={f('small')}
          style={{ width: 'auto' }}
          value={this.state.pageSize}
          onChange={this._handleChange}
          onBlur={this._handleChange}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>{' '}
        results
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.navigation.pageSize,
  customLocationSelector,
  (pageSize, customLocation) => ({ pageSize, customLocation }),
);

export default connect(
  mapStateToProps,
  { changePageSize, goToCustomLocation },
)(PageSizeSelector);
