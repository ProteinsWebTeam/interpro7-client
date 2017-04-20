/* eslint no-magic-numbers: [1, {ignore: [-1, 1, 10, 15, 30, 100]}] */
import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import {foundationPartial} from 'styles/foundation';
import {goToLocation, changePageSize} from 'actions/creators';

import s from './style.css';

const f = foundationPartial(s);

class PageSizeSelector extends Component{
  static propTypes = {
    search: T.object,
    pageSize: T.number,
    router: T.object,
    pathname: T.string,
    changePageSize: T.func,
    goToLocation: T.func,
  };

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.applyAll = this.applyAll.bind(this);
    this.state = {
      pageSize: props.search.page_size ? props.search.page_size : props.pageSize,
    };
  }

  handleChange(event) {
    this.setState({pageSize: event.target.value});
    this.props.goToLocation({
      pathname: this.props.pathname,
      search: {
        ...this.props.search, page_size: event.target.value,
        page: 1,
      },
    });
  }

  applyAll(){
    this.props.changePageSize(this.state.pageSize);
  }

  render(){
    const options = [10, 15, 30, 100];
    if (options.indexOf(this.state.pageSize * 1) === -1) {
      options.push(this.state.pageSize);
      options.sort((a, b) => a - b);
    }
    return (
      <div className={f('float-left')}>
        Show <select
          className={f('small')}
          style={{width: 'auto'}}
          value = {this.state.pageSize}
          onChange={this.handleChange}
             >
        {
          options.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))
        }
        </select> results
        <a className=
             {f('icon', 'icon-functional', 'primary', 'apply-all')}
          data-icon="s"
          onClick={this.applyAll}
        > <div>Apply to all tables</div></a>
      </div>
    );
  }
}

export default connect(
  ({settings: {pagination: {pageSize}}, location: {pathname}}) => (
    {pageSize, pathname}
  ),
  {changePageSize, goToLocation}
)(PageSizeSelector);
// export default PageSizeSelector;
