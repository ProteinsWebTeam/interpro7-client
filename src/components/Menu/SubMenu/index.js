// @flow
import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import MenuItem from 'components/Menu/MenuItem';

import {foundationPartial} from 'styles/foundation';
import menuItemStyle from 'components/Menu/MenuItem/style.css';
import style from './style.css';

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
  };

  render() {
    const {options, className = '', children} = this.props;
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
              className={f('menu-label', 'menu-item')}
              onClick={this.handleClick}
            >
              Back to InterPro menu
            </a>
          </li>
          {options.map(({newTo, name}) => (
            <li key={name}>
              <MenuItem newTo={newTo}>
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

const mapStateToProps = createSelector(
  state => state.ui.sideNav,
  visible => ({visible})
);

export default connect(mapStateToProps)(SubMenu);
