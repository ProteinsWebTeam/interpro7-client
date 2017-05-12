import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import PopperJS from 'popper.js';

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
  state = {
    entryHovered: null,
  }
  componentDidMount(){
    const {protein, data} = this.props;
    this.ec = new EntryComponent(this._container, protein, data);
    this.ec.on('entryclick', e => {
      this.props.goToLocation(`/entry/${e.source_database}/${e.accession}`);
    });
    this.ec.on('entrymouseover', e => {
      this._popper.classList.remove('hide');
      this._popper.appendChild(this.getElementFromEntry(e.entry));
      this.popper = new PopperJS(e.event.g[0], this._popper, {
        placement: 'top',
        applyStyle: {enabled: false},
      });
    });
    this.ec.on('entrymouseout', () => {
      this._popper.removeChild(this._popper.lastChild);
      this.popper.destroy();
      this._popper.classList.add('hide');
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
  getElementFromEntry(entry){
    const tagString =
      `<div>
        <h4>${entry.accession}</h4>
        <p>${entry.entry_type}</p>
      </div>`;
    const range = document.createRange();
    range.selectNode(document.getElementsByTagName('div').item(0));
    return range.createContextualFragment(tagString);

  }
  render(){
    return (
      <div>
        <div className={s('buttons')}>
          <button onClick={this.handleCollapse}>Collapse All</button> |
          <button onClick={this.handleExpand}>Expand All</button>
        </div>
        <div ref={e => this._container = e}/>
        <div ref={e => this._popper = e} className={s('popper', 'hide')}>
          <div className={s('popper__arrow')}/>
        </div>
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
