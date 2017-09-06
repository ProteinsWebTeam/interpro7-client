// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MenuItem from 'components/Menu/MenuItem';

import config from 'config';
import { singleEntity } from 'menuConfig';

/*:: type Props = {
  className: ?string,
  children: ?any,
  mainAccession: ?string,
  mainType: ?string,
}; */

class SingleEntityMenu extends PureComponent /*:: <Props> */ {
  static propTypes = {
    className: T.string,
    children: T.any,
    mainAccession: T.string,
    mainType: T.string,
  };

  render() {
    const { className, children, mainAccession, mainType } = this.props;
    let tabs = [];
    if (mainAccession && mainType && config.pages[mainType]) {
      tabs.push(singleEntity.get('overview'));
      for (const subPage of config.pages[mainType].subPages) {
        tabs.push(singleEntity.get(subPage));
      }
    }
    tabs = tabs.filter(Boolean);
    return (
      <ul className={className}>
        {children}
        {tabs.map(e => (
          <li key={e.name}>
            <MenuItem newTo={e.newTo} disabled={false}>
              {e.name}
            </MenuItem>
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainAccess,
  state => state.newLocation.description.mainType,
  (mainAccession, mainType) => ({ mainAccession, mainType })
);

export default connect(mapStateToProps)(SingleEntityMenu);
