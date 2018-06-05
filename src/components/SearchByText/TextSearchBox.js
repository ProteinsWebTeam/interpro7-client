// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, fonts, local);

const DEBOUNCE_RATE = 1000; // 1s

/*:: type Props = {
  pageSize?: number,
  main: ?string,
  value: ?string,
  className?: string,
  goToCustomLocation: function,
  inputRef: function,
}; */
/*:: type State = {|
  localValue: ?string,
|} */

class TextSearchBox extends PureComponent /*:: <Props, State> */ {
  /* ::
    _debouncedPush: ?boolean => void;
  */
  static propTypes = {
    pageSize: T.number,
    main: T.string,
    value: T.string,
    className: T.string,
    goToCustomLocation: T.func,
    inputRef: T.func,
  };

  constructor(props) {
    super(props);

    this.state = { localValue: null };

    this._debouncedPush = debounce(this.routerPush, DEBOUNCE_RATE);
  }

  routerPush = replace => {
    const { pageSize } = this.props;
    const query /*: { page: number, page_size?: number } */ = { page: 1 };
    if (pageSize) query.page_size = pageSize;
    this.props.goToCustomLocation(
      {
        description: {
          main: { key: 'search' },
          search: { type: 'text', value: this.state.localValue },
        },
        search: query,
      },
      replace,
    );
  };

  handleKeyPress = target => {
    const enterKey = 13;
    if (target.charCode === enterKey) {
      this.routerPush();
    }
  };

  handleChange = ({ target }) => {
    this.setState({ localValue: target.value });
    this._debouncedPush(true);
  };

  render() {
    return (
      <div className={f('input-group', 'margin-bottom-small')}>
        <div className={f('search-input-box')}>
          <input
            type="text"
            aria-label="search InterPro"
            onChange={this.handleChange}
            value={
              this.state.localValue === null
                ? this.props.value || ''
                : this.state.localValue
            }
            placeholder="Enter your search"
            onKeyPress={this.handleKeyPress}
            className={this.props.className}
            required
            ref={this.props.inputRef}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.main.key,
  state => state.customLocation.description.search.value,
  state => state.customLocation.search.page_size,
  (main, value, pageSize) => ({ main, value, pageSize }),
);

export default connect(mapStateToProps, { goToCustomLocation })(TextSearchBox);
