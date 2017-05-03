import React, {Component} from 'react';
import T from 'prop-types';

import EntryComponent from './entry_component';

import classname from 'classnames/bind';
import styles from './style.css';
const s = classname.bind(styles);

class DomainArchitecture extends Component {
  static propTypes = {
    protein: T.object,
    data: T.object,
  };
  componentDidMount(){
    const {protein, data} = this.props;
    this.ec = new EntryComponent(this._container, protein, data);
  }
  shouldComponentUpdate(){
    return false;
  }
  componentWillUnmount(){
    this.ec.destructor();
  }
  handleCollapse = () => {
    this.ec.collapseAll();
  }
  handleExpand = () => {
    this.ec.expandAll();
  }
  render(){
    return (
      <div>
        <div className={s('buttons')}>
          <button onClick={this.handleCollapse}>Collapse All</button> |
          <button onClick={this.handleExpand}>Expand All</button>
        </div>
        <div ref={e => this._container = e}/>
      </div>
    );
  }
}
export default DomainArchitecture;
