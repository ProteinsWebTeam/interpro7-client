import React, {Component, PropTypes as T, Children} from 'react';
import Redirect from 'react-router/Redirect';

import {foundationPartial} from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);

export default class extends Component {
  static propTypes = {
    children: T.any,
  };

  constructor(props){
    super(props);
    this.state = {activeTab: 0};
  }

  _handleChangeTab = index => () => this.setState({activeTab: index});

  render() {
    const {children} = this.props;
    const {activeTab} = this.state;
    const _children = Children.toArray(children);
    const _child = _children[activeTab];
    return (
      <div>
        <ul className={f('tabs')}>
          {
            _children.map((child, i) => (
              <li
                className={f(
                  'tabs-title', {
                    'is-active': activeTab === i,
                  })}
                key={i}
              >
                <button onClick={this._handleChangeTab(i)}>
                  {activeTab === i && <Redirect to={_child.props.to} push />}
                  {child.props.title}
                </button>
              </li>
            ))
          }
        </ul>

        <div
          className={f('tabs', 'tabs-content')}
        >
          {/*
            _children.map((child, i) => (
              <div
                key={i}
                className={f('tabs-panel', {
                  'is-active': activeTab === i,
                }) + ' ' + (child.props.className || '')}
              >
                {child.props.children}
              </div>
            ))
          */}
          <div
            className={[
              f('tabs-panel', 'is-active'),
              (_child.props.className || ''),
            ].join(' ').trim()}
          >
            {_child.props.children}
          </div>
        </div>
      </div>
    );
  }
}
