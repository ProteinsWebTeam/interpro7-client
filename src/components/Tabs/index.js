import React, { PureComponent, Children } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);

export default class Tabs extends PureComponent {
  static propTypes = {
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };
  }

  _handleChangeTab = index => () => this.setState({ activeTab: index });

  render() {
    const { children } = this.props;
    const { activeTab } = this.state;
    const _children = Children.toArray(children);
    const _child = _children[activeTab];
    return (
      <div>
        <ul className={f('tabs', 'main-style')}>
          {_children.map((child, i) => (
            <li
              className={f('tabs-title', { 'is-active': activeTab === i })}
              key={i}
            >
              <button
                onClick={this._handleChangeTab(i)}
                data-testid={
                  'data-testid' in child.props
                    ? child.props['data-testid']
                    : null
                }
              >
                {child.props.title}
              </button>
            </li>
          ))}
        </ul>

        <div className={f('tabs', 'tabs-content')}>
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
              _child.props.className || '',
            ]
              .join(' ')
              .trim()}
          >
            {_child.props.children}
          </div>
        </div>
      </div>
    );
  }
}
