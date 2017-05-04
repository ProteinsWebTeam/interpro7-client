import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';

import {goToLocation} from 'actions/creators';

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
    this.ec.on('entryclick', e => {
      this.props.goToLocation(`/entry/${e.source_database}/${e.accession}`);
    });
    this.ec.on('entrymouseover', e => {
      console.log('mouseover', e);
    });
    this.ec.on('entrymouseout', e => {
      console.log('mouseout', e);
    });
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

DomainArchitecture.propTypes = {
  goToLocation: T.func.isRequired,
  data: T.object,
  protein: T.object,
};

export default connect(null, {goToLocation})(DomainArchitecture);
