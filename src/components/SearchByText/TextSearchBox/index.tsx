import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';

import { goToCustomLocation } from 'actions/creators';
import getURLByAccession from 'utils/processDescription/getURLbyAccession';

import searchStorage from 'storage/searchStorage';

import Select, { InputActionMeta, SelectInstance } from 'react-select';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const css = cssBinder(fonts, local);

export const DEBOUNCE_RATE = 1000; // 1s
export const DEBOUNCE_RATE_SLOW = 2000; // 2s

type Props = {
  pageSize?: number;
  main?: string;
  value?: string | null;
  className?: string;
  goToCustomLocation: typeof goToCustomLocation;
  delay?: number;
  shouldRedirect?: boolean;
  forHeader?: boolean;
};
type State = {
  localValue?: string | null;
  loading?: boolean;
  searchHistory: Array<string>;
};

class TextSearchBox extends PureComponent<Props, State> {
  private select: React.RefObject<
    SelectInstance<{ value: string; label: string }>
  >;

  constructor(props: Props) {
    super(props);

    this.state = { localValue: null, loading: false, searchHistory: [] };

    this.select = React.createRef();
  }

  componentDidMount() {
    this._updateStateFromProps();
    if (searchStorage)
      this.setState({
        searchHistory: (searchStorage.getValue() as string[]) || [],
      });
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
  routerPush = (replace?: boolean) => {
    const { pageSize, shouldRedirect } = this.props;
    const query: { page: number; page_size?: number } = { page: 1 };
    if (pageSize) query.page_size = Number(pageSize);
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

    let tmpSearchHistory = this.state.searchHistory;
    if (value && !this.state.searchHistory.includes(value)) {
      tmpSearchHistory = [value, ...this.state.searchHistory];
      this.setState({ searchHistory: tmpSearchHistory });
    }
    searchStorage.setValue(tmpSearchHistory);

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
  private debouncedPush = debounce(
    this.routerPush,
    this.props.delay || DEBOUNCE_RATE,
  );

  handleKeyPress: React.KeyboardEventHandler<HTMLDivElement> = (target) => {
    if (target.code === 'Enter') {
      this.routerPush();
    }
  };

  handleChange = (term: string, { action }: InputActionMeta) => {
    if (action === 'input-change') {
      this.setState({ localValue: term, loading: true }, () =>
        this.debouncedPush(true),
      );
    }
  };

  setSelection = (selection: { value?: string } | null) => {
    this.setState({ localValue: selection?.value, loading: true }, () =>
      this.debouncedPush(true),
    );
  };

  focus() {
    if (this.select) this.select?.current?.focus();
  }

  render() {
    return (
      <div className={css('input-group', 'margin-bottom-small')}>
        <div className={css('search-input-box')}>
          <Select
            options={(this.state.searchHistory || []).map((term) => ({
              value: term,
              label: term,
            }))}
            ref={this.select}
            className={css(this.props.className, 'select-search', {
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
  (state: GlobalState) => state.customLocation.description.main.key!,
  (state: GlobalState) => state.customLocation.description.search.value,
  (state: GlobalState) => state.customLocation.search.page_size,
  (main, value, pageSize) => ({ main, value, pageSize }),
);

export default connect(mapStateToProps, { goToCustomLocation }, null, {
  forwardRef: true,
})(TextSearchBox);
