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

const f = foundationPartial(s);

const DEBOUNCE_RATE = 500; // In ms

/*:: type Props = {
  customLocation: CustomLocation,
  goToCustomLocation: goToCustomLocation,
  children?: ?string,
}; */
/*:: type State = {|
  localSearch: ?string,
|}; */

class SearchBox extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    customLocation: T.object.isRequired,
    goToCustomLocation: T.func.isRequired,
    children: T.string,
  };

  constructor(props) {
    super(props);

    this.routerPush = debounce(this.routerPush, DEBOUNCE_RATE);

    this.state = { localSearch: null };
  }

  componentDidUpdate() {
    this.routerPush.cancel();
  }

  handleReset = () => this.handleChange({ target: { value: null } });

  handleChange = ({ target: { value: search } }) =>
    this.setState({ localSearch: search }, this.routerPush);

  routerPush = () => {
    const { page, search, ...rest } = this.props.customLocation.search;
    if (this.state.localSearch) rest.search = this.state.localSearch;
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: rest,
    });
  };

  render() {
    return (
      <div className={f('table-filter')}>
        <div className={f('filter-box')}>
          <input
            id="table-filter-text"
            type="text"
            value={
              this.state.localSearch === null
                ? this.props.customLocation.search.search || ''
                : this.state.localSearch
            }
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
  customLocation => ({ customLocation }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(SearchBox);
