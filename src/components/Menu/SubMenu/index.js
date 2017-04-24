// @flow
import React, {Component} from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import {foundationPartial} from 'styles/foundation';
import menuItemStyle from 'components/Menu/MenuItem/style.css';
import style from './style.css';
import {connect} from 'react-redux';

const f = foundationPartial(menuItemStyle, style);

/* ::
   type Props = {
     pathname: string,
     visible: boolean,
     options: Array<Object>,
     className?: string,
     children?: any
   };
 */
class SubMenu extends Component {
  /* ::
   props: Props;
   state: {isActive: boolean};
   */
  constructor(props/* : Props*/) {
    super(props);
    this.state = {isActive: false};
  }
  componentWillReceiveProps({visible}) {
    if (!visible) this.setState({isActive: false});
  }
  handleClick = () => {
    this.setState({isActive: !this.state.isActive});
  }
  render() {
    const {pathname, options, className = '', children} = this.props;
    return (
      <li className={f('is-drilldown-submenu-parent')}>
        <a className={f('menu-item')} onClick={this.handleClick}>
          {children}
        </a>
        <ul
          className={`${f('is-drilldown-submenu', 'submenu', {
            'is-active': this.state.isActive,
          })} ${className}`}
        >
          <li className={f('js-drilldown-back')}>
            <a
              className={f('menu-label')}
              onClick={this.handleClick}
            >
              Back to InterPro menu
            </a>
          </li>
          {options.map(({to, name}) => (
            <li key={to}>
              <MenuItem to={to} active={pathname === to}>
                {name}
              </MenuItem>
            </li>
          ))}
        </ul>
      </li>
    );
  }

}
SubMenu.propTypes = {
  pathname: T.string.isRequired,
  visible: T.bool.isRequired,
  className: T.string,
  options: T.array,
  children: T.any,
};

export default connect(({ui: {sideNav}}) => ({visible: sideNav}))(SubMenu);
