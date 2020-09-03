// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';

import { customLocationSelector } from 'reducers/custom-location';
import { goToCustomLocation } from 'actions/creators';
/*:: import type { CustomLocation } from 'actions/creators'; */

import { foundationPartial } from 'styles/foundation';

import s from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(fonts, s);

const DEBOUNCE_RATE = 500; // In ms

/*:: type Props = {
  customLocation: CustomLocation,
  goToCustomLocation: goToCustomLocation,
  loading?: ?boolean,
  children?: ?string,
  field?: ?string,
}; */
/*:: type State = {|
  localSearch: ?string,
|}; */

export class SearchBox extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    customLocation: T.object.isRequired,
    goToCustomLocation: T.func.isRequired,
    children: T.string,
    loading: T.bool,
    field: T.string,
  };

  constructor(props /*: Props */) {
    super(props);

    this.routerPush = debounce(this.routerPush, DEBOUNCE_RATE);

    this.state = { localSearch: null };
  }

  componentDidUpdate() {
    this.routerPush.cancel();
    this.handleUpdateOfWaitingForRoute();
  }
  isWaitingForRouter = false;
  handleUpdateOfWaitingForRoute = () => {
    if (
      !this.isWaitingForRouter &&
      this.props.customLocation.search?.search !== this.state.localSearch
    ) {
      this.setState({ localSearch: null });
    }
    if (
      this.isWaitingForRouter &&
      this.props.customLocation.search?.search === this.state.localSearch
    ) {
      this.isWaitingForRouter = false;
    }
  };

  handleReset = () => this.handleChange({ target: { value: null } });

  handleChange = (
    { target: { value: search } } /*: {target: {value: ?string}} */,
  ) => {
    this.isWaitingForRouter = true;
    this.setState({ localSearch: search }, this.routerPush);
  };

  routerPush = () => {
    const { page, cursor, ...rest } = this.props.customLocation.search;
    const field = this.props.field || 'search';
    if (this.state.localSearch) {
      rest[field] = this.state.localSearch;
    } else {
      delete rest[field];
    }
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: rest,
    });
  };

  render() {
    const text =
      this.state.localSearch === null
        ? this.props.customLocation.search[this.props.field || 'search'] || ''
        : this.state.localSearch;

    return (
      <div className={f('table-filter')}>
        <div className={f('filter-box', { loading: this.props.loading })}>
          <input
            id="table-filter-text"
            type="text"
            value={text}
            onChange={this.handleChange}
            placeholder={this.props.children || 'Search'}
          />
          <button
            className={f('cancel-button')}
            type="button"
            aria-label="Cancel button"
            onClick={this.handleReset}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, {
  goToCustomLocation,
})(SearchBox);
