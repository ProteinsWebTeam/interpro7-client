// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';

import { goToCustomLocation } from 'actions/creators';
import getURLByAccession from 'utils/processDescription/getURLbyAccession';
import searchStorage from 'storage/searchStorage';

import Autocomplete from 'react-autocomplete';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, fonts, local);

export const DEBOUNCE_RATE = 1000; // 1s
export const DEBOUNCE_RATE_SLOW = 2000; // 2s

/*:: type Props = {
  pageSize?: number,
  main: ?string,
  value: ?string,
  className?: string,
  goToCustomLocation: typeof goToCustomLocation,
  inputRef: function,
  delay?: ?number,
  shouldRedirect?: ?boolean,
}; */
/*:: type State = {|
  localValue: ?string,
  loading: ?boolean,
|} */

class TextSearchBox extends PureComponent /*:: <Props, State> */ {
  /*:: _debouncedPush: ?boolean => void; */
  /*:: searchHistory: Array<any>; */

  static propTypes = {
    pageSize: T.number,
    main: T.string,
    value: T.string,
    className: T.string,
    goToCustomLocation: T.func,
    inputRef: T.func,
    delay: T.number,
    shouldRedirect: T.bool,
  };

  constructor(props) {
    super(props);

    this.state = { localValue: null, loading: false };

    this._debouncedPush = debounce(
      this.routerPush,
      +props.delay || DEBOUNCE_RATE,
    );

    this.searchHistory = [];
  }

  componentDidMount() {
    this._updateStateFromProps();
    if (searchStorage) this.searchHistory = searchStorage.getValue() || [];
  }

  componentDidUpdate() {
    this._updateStateFromProps();
  }

  _updateStateFromProps() {
    if (!this.state.loading && this.props.value !== this.state.localValue) {
      this.setState({ localValue: this.props.value, loading: true });
    }
    if (this.props.value === this.state.localValue) {
      this.setState({ loading: false });
    }
  }
  routerPush = (replace) => {
    const { pageSize, shouldRedirect } = this.props;
    const query /*: { page: number, page_size?: number } */ = { page: 1 };
    if (pageSize) query.page_size = pageSize;
    const value = this.state.localValue
      ? this.state.localValue.trim()
      : this.state.localValue;
    if (shouldRedirect) {
      const directLinkDescription = getURLByAccession(value);
      if (directLinkDescription) {
        this.props.goToCustomLocation({
          description: directLinkDescription,
        });
        return;
      }
    }

    if (value && !this.searchHistory.includes(value))
      this.searchHistory.push(value);
    searchStorage.setValue(this.searchHistory);

    // Finally just trigger a search
    this.props.goToCustomLocation(
      {
        description: {
          main: { key: 'search' },
          search: {
            type: 'text',
            value,
          },
        },
        search: query,
      },
      replace,
    );
  };

  handleKeyPress = (target) => {
    const enterKey = 13;
    if (target.charCode === enterKey) {
      this.routerPush();
    }
  };

  handleChange = ({ target }) => {
    this.setState(
      { localValue: target.value, loading: true },
      this._debouncedPush(true),
    );
  };

  setSelection = (value) => {
    this.setState(
      { localValue: value, loading: true },
      this._debouncedPush(true),
    );
  };

  render() {
    return (
      <div className={f('input-group', 'margin-bottom-small')}>
        <div className={f('search-input-box')}>
          <Autocomplete
            inputProps={{
              id: 'search-terms-autocomplete',
              ref: this.props.inputRef,
              className: this.props.className,
              type: 'text',
              placeholder: 'Enter your search',
              required: true,
            }}
            getItemValue={(item) => item}
            items={this.searchHistory}
            renderItem={(item, isHighlighted) => (
              <div
                style={{ background: isHighlighted ? 'lightgray' : 'white' }}
                key={item}
              >
                <div style={{ fontWeight: 'bold' }}>{item}</div>
              </div>
            )}
            onChange={this.handleChange}
            onSelect={(val) => this.setSelection(val)}
            value={this.state.localValue || ''}
            onKeyPress={this.handleKeyPress}
            renderInput={(props) => <input {...props} />}
            wrapperProps={{ style: { display: 'block' } }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) => state.customLocation.description.search.value,
  (state) => state.customLocation.search.page_size,
  (main, value, pageSize) => ({ main, value, pageSize }),
);

export default connect(mapStateToProps, { goToCustomLocation })(TextSearchBox);
