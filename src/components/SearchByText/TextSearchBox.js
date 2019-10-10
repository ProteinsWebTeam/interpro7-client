// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';

import { ENTRY_DBS } from 'utils/url-patterns';

import { goToCustomLocation } from 'actions/creators';
import descriptionToDescription from 'utils/processDescription/descriptionToDescription';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, fonts, local);

export const DEBOUNCE_RATE = 1000; // 1s
export const DEBOUNCE_RATE_SLOW = 2000; // 2s

const otherEndpoints = {
  protein: 'uniprot',
  structure: 'pdb',
  proteome: 'uniprot',
  taxonomy: 'uniprot',
  set: 'all',
};
const isDescriptionValid = description => {
  try {
    descriptionToDescription(description);
    return true;
  } catch (error) {
    return false;
  }
};
/*:: type Props = {
  pageSize?: number,
  main: ?string,
  value: ?string,
  className?: string,
  goToCustomLocation: goToCustomLocation,
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
  }

  componentDidMount() {
    this._updateStateFromProps();
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
  routerPush = replace => {
    const { pageSize, shouldRedirect } = this.props;
    const query /*: { page: number, page_size?: number } */ = { page: 1 };
    if (pageSize) query.page_size = pageSize;
    const value = this.state.localValue
      ? this.state.localValue.trim()
      : this.state.localValue;
    const directLinkDescription = {
      main: { key: 'entry' },
      entry: {
        accession: value,
        db: 'InterPro',
      },
    };
    if (shouldRedirect) {
      // First check for exact match in InterPro
      if (isDescriptionValid(directLinkDescription)) {
        this.props.goToCustomLocation({
          description: directLinkDescription,
        });
        return;
      }
      // Then for exact match in other member DBs
      for (const db of ENTRY_DBS) {
        directLinkDescription.entry.db = db;
        if (isDescriptionValid(directLinkDescription)) {
          this.props.goToCustomLocation({
            description: directLinkDescription,
          });
          return;
        }
      }
      // Then cehcking other endpoints
      for (const [ep, db] of Object.entries(otherEndpoints)) {
        const directEndpointLinkDescription = {
          main: { key: ep },
          [ep]: {
            accession: value,
            db,
          },
        };
        if (isDescriptionValid(directEndpointLinkDescription)) {
          this.props.goToCustomLocation({
            description: directEndpointLinkDescription,
          });
          return;
        }
      }
    }
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

  handleKeyPress = target => {
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

  render() {
    return (
      <div className={f('input-group', 'margin-bottom-small')}>
        <div className={f('search-input-box')}>
          <input
            type="text"
            aria-label="search InterPro"
            onChange={this.handleChange}
            value={this.state.localValue || ''}
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

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(TextSearchBox);
