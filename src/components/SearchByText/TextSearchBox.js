import React, {PropTypes as T, Component} from 'react';
import {withRouter} from 'react-router/es';
import {connect} from 'react-redux';

class TextSearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
  }
  componentWillReceiveProps({value = '', toSubmit = false}) {
    if (toSubmit) this.routerPush();
    this.setState({value});
  }

  routerPush = () => {
    const {pageSize} = this.props,
      pathname = '/search';
    const query/*: {page: number, page_size: number, search?: string} */ = {
      page: 1,
      page_size: pageSize,
    };
    const {value: search} = this.state;
    if (search) query.search = search;
    this.props.router.push({pathname, query});
  };

  handleKeyPress = (target) => {
    const enterKey = 13;
    if (target.charCode === enterKey) {
      this.routerPush();
    }
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  render() {
    const {value} = this.state;
    return (
      <input
        type="text"
        onChange={this.handleChange}
        value={value}
        placeholder="Enter your search"
        onKeyPress={this.handleKeyPress}
        className={this.props.className}
      />
    );
  }
}
TextSearchBox.propTypes = {
  pageSize: T.number,
  router: T.object,
  value: T.string,
  className: T.string,
};

export default withRouter(
  connect(({settings: {pagination: {pageSize}}}) =>
    ({pageSize}))(TextSearchBox)
);
