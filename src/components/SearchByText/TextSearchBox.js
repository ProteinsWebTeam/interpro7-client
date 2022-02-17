// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';
import loadable from 'higherOrder/loadable';

import { goToCustomLocation } from 'actions/creators';
import getURLByAccession from 'utils/processDescription/getURLbyAccession';
import searchStorage from 'storage/searchStorage';

// $FlowFixMe
// import Select from 'react-select';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, fonts, local);

const Select = loadable({
  loader: () => import(/* webpackChunkName: "react-select" */ 'react-select'),
});

export const DEBOUNCE_RATE = 1000; // 1s
export const DEBOUNCE_RATE_SLOW = 2000; // 2s

/*:: type Props = {
  pageSize?: number,
  main: ?string,
  value: ?string,
  className?: string,
  goToCustomLocation: typeof goToCustomLocation,
  delay?: ?number,
  shouldRedirect?: ?boolean,
  forHeader?: ?boolean,
}; */
/*:: type State = {|
  localValue: ?string,
  loading: ?boolean,
  searchHistory: Array<string>
|} */

class TextSearchBox extends PureComponent /*:: <Props, State> */ {
  /*:: _debouncedPush: ?boolean => void; */
  /*:: _select: { current: null | React$ElementRef<'div'> }; */

  static propTypes = {
    pageSize: T.number,
    main: T.string,
    value: T.string,
    className: T.string,
    goToCustomLocation: T.func,
    delay: T.number,
    shouldRedirect: T.bool,
    forHeader: T.bool,
  };

  constructor(props) {
    super(props);

    this.state = { localValue: null, loading: false, searchHistory: [] };

    this._debouncedPush = debounce(
      this.routerPush,
      +props.delay || DEBOUNCE_RATE,
    );
    this._select = React.createRef();
  }

  componentDidMount() {
    this._updateStateFromProps();
    if (searchStorage)
      this.setState({ searchHistory: searchStorage.getValue() || [] });
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

    if (value && !this.state.searchHistory.includes(value))
      this.setState({ searchHistory: [value, ...this.state.searchHistory] });
    searchStorage.setValue(this.state.searchHistory);

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

  handleChange = (term, { action }) => {
    if (action === 'input-change') {
      this.setState(
        { localValue: term, loading: true },
        this._debouncedPush(true),
      );
    }
  };

  setSelection = (selection) => {
    this.setState(
      { localValue: selection?.value, loading: true },
      this._debouncedPush(true),
    );
  };

  focus() {
    if (this._select) this._select?.current?.focus();
  }

  render() {
    return (
      <div className={f('input-group', 'margin-bottom-small')}>
        <div className={f('search-input-box')}>
          <Select
            options={(this.state.searchHistory || []).map((term) => ({
              value: term,
              label: term,
            }))}
            ref={this._select}
            className={f(this.props.className, 'select-search', {
              header: this.props.forHeader,
            })}
            placeholder="Enter your search"
            onKeyDown={this.handleKeyPress}
            onInputChange={this.handleChange}
            onChange={(val) => this.setSelection(val)}
            value={{
              value: this.state.localValue || '',
              label: this.state.localValue || '',
            }}
            inputValue={this.state.localValue || ''}
            inputId="search-terms-autocomplete"
            isClearable={true}
            styles={{
              indicatorsContainer: (provided) => ({
                ...provided,
                display: this.props.forHeader ? 'none' : 'flex',
              }),
              menu: (provided) => ({
                ...provided,
                display: this.props.forHeader ? 'none' : 'flex',
              }),
              menuList: (provided) => ({
                ...provided,
                width: '100%',
              }),
              input: (css) => ({
                ...css,
                // For the paste option on right click to work, the input div has to be 100%
                flex: '1 1 auto',
                '> div': {
                  width: '100%',
                },
                input: {
                  minWidth: '7rem !important',
                  textAlign: 'left',
                },
              }),
            }}
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

export default connect(mapStateToProps, { goToCustomLocation }, null, {
  forwardRef: true,
})(TextSearchBox);
