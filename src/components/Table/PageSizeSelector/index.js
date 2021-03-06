// @flow
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
  props => +(props.customLocation.search.page_size || props.settingsPageSize),
);
/*:: type Props = {
  customLocation: Object,
  settingsPageSize: number,
  changePosition: function,
  goToCustomLocation: function,
}; */

/*:: type State = {
  pageSize: number
}; */
class PageSizeSelector extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    customLocation: T.object.isRequired,
    settingsPageSize: T.number,
    changePageSize: T.func,
    goToCustomLocation: T.func,
  };

  _handleChange = event => {
    this.setState({ pageSize: event.target.value });
    const { cursor, page, ...search } = this.props.customLocation.search;
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: {
        ...search,
        page_size: +event.target.value,
      },
    });
  };

  render() {
    let options = [...OPTIONS];
    if (!options.includes(getPageSize(this.props))) {
      options = Array.from(new Set([...options, getPageSize(this.props)])).sort(
        (a, b) => a - b,
      );
    }
    return (
      <div className={f('table-length')}>
        Show{' '}
        <select
          className={f('small')}
          style={{ width: 'auto' }}
          value={getPageSize(this.props)}
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
  (settingsPageSize, customLocation) => ({ settingsPageSize, customLocation }),
);

export default connect(
  mapStateToProps,
  { changePageSize, goToCustomLocation },
)(PageSizeSelector);
