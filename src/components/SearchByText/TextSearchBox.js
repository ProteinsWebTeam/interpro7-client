import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, fonts, local);

const MAX_PAD = 6;
const pad = n => (n.length < MAX_PAD ? pad(`0${n}`) : n);

class TextSearchBox extends Component {
  static propTypes = {
    pageSize: T.number,
    value: T.string,
    className: T.string,
    toSubmit: T.bool,
    goToCustomLocation: T.func,
    search: T.shape({
      search: T.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  componentWillMount() {
    if (this.props.search) this.setState({ value: this.props.search.search });
  }

  componentWillReceiveProps(nextProps) {
    const { value = '', toSubmit = false } = nextProps;
    if (this.props.value === value && this.props.toSubmit === toSubmit) return;
    this.setState({ value });
    if (toSubmit) this.routerPush();
  }

  routerPush = () => {
    const { pageSize } = this.props;
    const query /*: {page: number, page_size: number, search?: string} */ = {
      page: 1,
      page_size: pageSize,
    };
    const { value: search } = this.state;
    if (search) {
      if (isNaN(Number(search))) {
        query.search = search;
      } else {
        query.search = `IPR${pad(search)}`;
      }
    }
    // this.setState({redirecting: {pathname, query}});
    this.props.goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: { type: 'text', value: query },
      },
    });
  };

  handleKeyPress = target => {
    const enterKey = 13;
    if (target.charCode === enterKey) {
      this.routerPush();
    }
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className={f('input-group', 'margin-bottom-small')}>
        <div className={f('search-input-box')}>
          <input
            type="text"
            aria-label="search InterPro"
            onChange={this.handleChange}
            value={value}
            placeholder="Enter your search"
            onKeyPress={this.handleKeyPress}
            className={this.props.className}
            required
          />
          {
            // <button className={f('close-icon')} onClick={this.handleReset} onKeyPress={this.handleReset}></button>
          }
        </div>
        {
          // <div className={f('input-group-button',  'margin-top-none')}>
          //  <input className={f('button','icon','icon-functional')} type="submit" name="submit" value="1"
          //        onClick={this.handleSubmitClick}
          //       onKeyPress={this.handleSubmitClick}/>
          // </div>
        }
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.pagination.pageSize,
  pageSize => ({ pageSize }),
);

export default connect(mapStateToProps, { goToCustomLocation })(TextSearchBox);
