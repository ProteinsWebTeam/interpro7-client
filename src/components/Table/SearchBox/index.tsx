import React, { FormEvent, PureComponent } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce, DebouncedFunc } from 'lodash-es';

import { goToCustomLocation } from 'actions/creators';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';

import s from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, s);

const DEBOUNCE_RATE = 500; // In ms

type Props = {
  customLocation?: InterProLocation;
  goToCustomLocation?: typeof goToCustomLocation;
  loading?: boolean;
  children?: string;
  field?: string;
  customiseSearch?: {
    type: string;
    validation: RegExp;
    message: string;
  };
};
type State = {
  localSearch: string | null;
  message: string;
};

export class SearchBox extends PureComponent<Props, State> {
  routerPush: DebouncedFunc<() => void>;
  isWaitingForRouter = false;

  constructor(props: Props) {
    super(props);
    this.routerPush = debounce(this.#routerPush, DEBOUNCE_RATE);
    this.state = { localSearch: null, message: '' };
  }

  componentDidUpdate() {
    this.routerPush.cancel();
    this.handleUpdateOfWaitingForRoute();
  }

  handleUpdateOfWaitingForRoute = () => {
    if (
      !this.isWaitingForRouter &&
      this.props.customLocation?.search?.search !== this.state.localSearch
    ) {
      this.setState({ localSearch: null });
    }
    if (
      this.isWaitingForRouter &&
      this.props.customLocation?.search?.search === this.state.localSearch
    ) {
      this.isWaitingForRouter = false;
    }
  };

  handleReset = () => this.handleChange();

  handleChange = (event?: FormEvent) => {
    const search = event ? (event.target as HTMLInputElement).value : null;
    this.isWaitingForRouter = true;
    this.setState({ localSearch: search }, this.routerPush);
  };

  #routerPush = () => {
    if (!this.props.customLocation) return;
    const { page, cursor, ...rest } = this.props.customLocation.search;
    const validation = this.props.customiseSearch?.validation;
    const field = this.props.field || 'search';
    if (this.state.localSearch) {
      if (validation) {
        if (
          typeof this.state.localSearch === 'string' &&
          validation.test(this.state.localSearch)
        ) {
          rest[field] = this.state.localSearch;
          this.setState({ message: '' });
        } else {
          this.setState({
            message:
              this.props.customiseSearch?.message || 'Invalid search term',
          });
        }
      } else {
        rest[field] = this.state.localSearch;
      }
    } else {
      delete rest[field];
      this.setState({ message: '' });
    }

    this.props.goToCustomLocation?.({
      ...this.props.customLocation,
      search: rest,
    });
  };

  render() {
    const text =
      this.state.localSearch === null
        ? (this.props.customLocation?.search[
            this.props.field || 'search'
          ] as string) || ''
        : this.state.localSearch;

    return (
      <div className={css('table-filter')}>
        <div className={css('filter-box', { loading: this.props.loading })}>
          {this.state.message === '' ? null : (
            <Tooltip
              title={this.state.message}
              class={css('validation-message')}
            >
              <span role="img" aria-label="warning">
                ⚠️
              </span>
            </Tooltip>
          )}
          <input
            id="table-filter-text"
            type={this.props.customiseSearch?.type || 'text'}
            value={text}
            onChange={this.handleChange}
            placeholder={this.props.children || 'Search'}
            className={css({ invalid: this.state.message !== '' })}
          />
          <button
            className={css('cancel-button')}
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
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, {
  goToCustomLocation,
})(SearchBox);
