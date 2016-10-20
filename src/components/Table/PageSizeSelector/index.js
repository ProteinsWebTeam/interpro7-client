import React, {PropTypes as T, Component} from 'react';
import {withRouter} from 'react-router/es6';
import {connect} from 'react-redux';
import {changePageSize} from 'actions/creators';
import {foundationPartial} from 'styles/foundation';
import s from './style.css';
const f = foundationPartial(s);

class PageSizeSelector extends Component{
  static propTypes = {
    query: T.object,
    pageSize: T.number.isRequired,
    router: T.object.isRequired,
    pathname: T.string.isRequired,
    changePageSize: T.func.isRequired,
  };
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.applyAll = this.applyAll.bind(this);
    this.state = {pageSize: props.pageSize}
  }
  handleChange(event) {
    console.log(this.props.pageSize, event.target.value);
    this.setState({pageSize: event.target.value});
    this.props.router.push({
      pathname: this.props.pathname,
      query: {
        ...this.props.query, page_size: event.target.value,
        page: 1,
      },
    });
  }
  applyAll(event){
    this.props.changePageSize(this.state.pageSize);
  }
  render(){
    return (
      <div className={f('float-left')}>
        Show <select
          className={f('small')}
          style={{width: 'auto'}}
          value = {this.state.pageSize}
          onChange={this.handleChange}
             >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="100">100</option>
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

export default withRouter(
  connect(({settings: {pagination: {pageSize}}}) => ({pageSize}),
  {changePageSize})(PageSizeSelector)
);
