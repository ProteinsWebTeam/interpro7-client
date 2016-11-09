// @flow
import React, {PropTypes as T} from 'react';
import {withRouter} from 'react-router/es';
import {connect} from 'react-redux';

import InterproMenu from 'components/Menu/InterproMenu';
import EntitiesMenu from 'components/Menu/EntitiesMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';

const styles = foundationPartial(ebiStyles, interproStyles);

const DynamicMenu = ({data, location: {pathname}}) => {
  if (!data || pathname === '/') {
    return <InterproMenu pathname={pathname} className={styles('menu')} />;
  }
  if (data.metadata) {
    return (
      <SingleEntityMenu
        data={data}
        pathname={pathname}
        className={styles('menu')}
      />
    );
  }
  return <EntitiesMenu className={styles('menu')} />;
};
DynamicMenu.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default withRouter(connect(({data: {data}}) => ({data}))(DynamicMenu));

