import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';
import {goToLocation} from 'actions/creators';

class TextSearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
  }

  componentWillReceiveProps(nextProps) {
    const {value = '', toSubmit = false} = nextProps;
    if (this.props.value === value && this.props.toSubmit === toSubmit) return;
    if (toSubmit) this.routerPush();
    this.setState({value});
  }

  routerPush = () => {
    const {pageSize} = this.props;
    const pathname = '/search';
    const query/*: {page: number, page_size: number, search?: string} */ = {
      page: 1,
      page_size: pageSize,
    };
    const {value: search} = this.state;
    if (search) query.search = search;
    // this.setState({redirecting: {pathname, query}});
    this.props.goToLocation({
      pathname,
      search: query,
    });

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
    // if (redirecting) return <Redirect to={redirecting} />;
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
  toSubmit: T.bool,
  goToLocation: T.func,
};

export default connect(
  ({settings: {pagination: {pageSize}}}) => ({pageSize}),
  {goToLocation}
)(TextSearchBox);
