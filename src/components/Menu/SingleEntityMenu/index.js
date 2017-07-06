import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MenuItem from 'components/Menu/MenuItem';

import { singleEntity } from 'menuConfig';

const SingleEntityMenu = ({ className, children, mainType }) => {
  const tabs = singleEntity.filter(e => e.type !== mainType);
  return (
    <ul className={className}>
      {children}
      {tabs.map(e =>
        <li key={e.name}>
          <MenuItem newTo={e.newTo} disabled={false}>
            {e.name}
          </MenuItem>
        </li>
      )}
    </ul>
  );
};
SingleEntityMenu.propTypes = {
  className: T.string,
  children: T.any,
  mainType: T.string,
};

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({ mainType })
);

export default connect(mapStateToProps)(SingleEntityMenu);
