import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash-es/debounce';

import f from 'styles/foundation';
import {goToLocation} from '../../../actions/creators';

const DEBOUNCE_RATE = 500;// In ms

class SearchBox extends Component {
  static propTypes = {
    query: T.string,
    search: T.object.isRequired,
    router: T.object.isRequired,
    pathname: T.string.isRequired,
    pageSize: T.number.isRequired,
    goToLocation: T.func,
  };

  constructor(props) {
    super(props);
    this.state = {search: props.query};
  }

  componentWillMount() {
    this.routerPush = debounce(this.routerPush, DEBOUNCE_RATE);
  }

  componentWillReceiveProps({query = ''}) {
    this.setState({query});
  }

  handleChange = ({target: {value: query}}) => {
    this.setState({query});
    this.routerPush();
  };

  handleReset = () => this.setState({query: ''}, this.routerPush);

  routerPush = () => {
    const {pageSize, pathname} = this.props;
    const query/*: {page: number, page_size: number, search?: string} */ = {
      page: 1,
      page_size: pageSize,
    };
    const {query: search} = this.state;
    if (search) query.search = search;
    this.props.goToLocation({pathname, search: query});
  };

  render() {
    const {search} = this.state;
    return (
      <div className={f('float-right')} style={{position: 'relative'}} >
        <form>
          <button
            className={f('close-button')}
            type="button"
            style={{right: '0.5rem', top: '0'}}
            onClick={this.handleReset}
          >
            <span>&times;</span>
          </button>
          <input
            id="table-filter-text"
            type="text"
            onChange={this.handleChange}
            value={search}
            placeholder="Filter table"
          />
        </form>
      </div>
    );
  }
}

export default connect(
  ({settings: {pagination: {pageSize}}, location: {pathname}}) => (
    {pageSize, pathname}
  ),
  {goToLocation}
)(SearchBox);
