import React, { Component } from 'react';
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

const INTERPRO_ACCESSION_PADDING = 6;
const DEBOUNCE_RATE = 1000; // 1s

class TextSearchBox extends Component {
  static propTypes = {
    pageSize: T.number,
    value: T.string,
    className: T.string,
    goToCustomLocation: T.func,
  };

  constructor(props) {
    super(props);

    this.state = { value: props.value || '' };

    this.debouncedPush = debounce(this.routerPush, DEBOUNCE_RATE);
  }

  componentWillReceiveProps({ value }) {
    this.setState({ value: value || '' });
  }

  routerPush = replace => {
    const { pageSize } = this.props;
    const query /*: {page: number, page_size: number, search?: string} */ = {
      page: 1,
      page_size: pageSize,
    };
    let { value } = this.state;
    if (!replace && Number.isFinite(+value)) {
      value = `IPR${value.padStart(INTERPRO_ACCESSION_PADDING, '0')}`;
    }
    // this.setState({redirecting: {pathname, query}});
    this.props.goToCustomLocation(
      {
        description: {
          main: { key: 'search' },
          search: { type: 'text', value },
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
    this.setState({ value: target.value });
    this.debouncedPush(true);
  };

  render() {
    return (
      <div className={f('input-group', 'margin-bottom-small')}>
        <div className={f('search-input-box')}>
          <input
            type="text"
            aria-label="search InterPro"
            onChange={this.handleChange}
            value={this.state.value}
            placeholder="Enter your search"
            onKeyPress={this.handleKeyPress}
            className={this.props.className}
            required
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.pagination.pageSize,
  state => state.customLocation.description.search.value,
  (pageSize, value) => ({ pageSize, value }),
);

export default connect(mapStateToProps, { goToCustomLocation })(TextSearchBox);
