/* eslint no-magic-numbers: [1, {ignore: [-1, 1, 10, 15, 30, 100]}] */
import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import {changePageSize} from 'actions/creators';
import {foundationPartial} from 'styles/foundation';

import s from './style.css';

const f = foundationPartial(s);

class PageSizeSelector extends Component{
  static propTypes = {
    query: T.object,
    pageSize: T.number,
    router: T.object,
    pathname: T.string,
    changePageSize: T.func,
  };

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.applyAll = this.applyAll.bind(this);
    this.state = {pageSize: props.pageSize};
  }

  handleChange(event) {
    this.setState({pageSize: event.target.value});
    this.props.router.push({
      pathname: this.props.pathname,
      query: {
        ...this.props.query, page_size: event.target.value,
        page: 1,
      },
    });
  }

  applyAll(){
    this.props.changePageSize(this.state.pageSize);
  }

  render(){
    const options = [10, 15, 30, 100];
    if (options.indexOf(this.state.pageSize) === -1) {
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
  {changePageSize}
)(PageSizeSelector);
