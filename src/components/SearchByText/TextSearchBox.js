import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToNewLocation } from 'actions/creators';

class TextSearchBox extends Component {
  static propTypes = {
    pageSize: T.number,
    value: T.string,
    className: T.string,
    toSubmit: T.bool,
    goToNewLocation: T.func,
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
    if (search) query.search = search;
    // this.setState({redirecting: {pathname, query}});
    this.props.goToNewLocation({
      description: {
        mainType: 'search',
        mainDB: 'text',
      },
      search: query,
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
    // if (redirecting) return <Redirect to={redirecting} />;
    return (
      <input
        type="text"
        aria-label="search InterPro"
        onChange={this.handleChange}
        value={value}
        placeholder="Enter your search"
        onKeyPress={this.handleKeyPress}
        className={this.props.className}
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.pagination.pageSize,
  pageSize => ({ pageSize }),
);

export default connect(mapStateToProps, { goToNewLocation })(TextSearchBox);
