// @flow
import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {closeSideNav} from 'actions/creators';
// import {EBI, InterPro, entities, singleEntity} from 'menuConfig';
// import MenuItem from 'components/Menu/MenuItem';

import EBIMenu from 'components/Menu/EBIMenu';
import InterproMenu from 'components/Menu/InterproMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

class SideMenu extends Component {
  shouldComponentUpdate({loading}) {
    return !loading;
  }

  render() {
    const {visible, location: {pathname}, data, closeSideNav} = this.props;
    return (
      <div>
        <aside
          className={f('container', {visible})}
          role="menu"
          aria-hidden={!visible}
          id="main-nav"
        >
          <button
            className={f('exit')}
            title="Close menu - handside navigation"
            onClick={closeSideNav}
            aria-hidden="true"
          >
            ×
          </button>
          <ul>
            {
              data && data.metadata &&
              <SingleEntityMenu
                data={data}
                pathname={pathname}
                className={f('primary')}
              >
                <span
                  className={f('menu-label', 'select-none', 'cursor-default')}
                >
                  {(
                    data.metadata.name.short ||
                    data.metadata.name.name ||
                    data.metadata.accession
                  )}
                </span>
              </SingleEntityMenu>
            }
            <InterproMenu
              pathname={pathname}
              className={f('secondary', 'is-drilldown')}
              includeSubMenus={true}
            >
              <span
                className={f('menu-label', 'select-none', 'cursor-default')}
              >
                interpro menu
              </span>
            </InterproMenu>
            <EBIMenu className={f('tertiary')}>
              <span
                className={f('menu-label', 'select-none', 'cursor-default')}
              >
                ebi menu
              </span>
            </EBIMenu>
          </ul>
        </aside>
      </div>
    );
  }
}
SideMenu.propTypes = {
  visible: T.bool.isRequired,
  data: T.object,
  loading: T.bool.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }),
  closeSideNav: T.func.isRequired,
};

export default withRouter(connect(
  ({ui: {sideNav}, data: {data, loading}}) => (
    {visible: sideNav, data, loading}
  ),
  {closeSideNav}
)(SideMenu));
