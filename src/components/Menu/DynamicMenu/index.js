// @flow
import React, {Component} from 'react';
import T from 'prop-types';

import InterproMenu from 'components/Menu/InterproMenu';
import EntitiesMenu from 'components/Menu/EntitiesMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import loadData from 'higherOrder/loadData';
import {getUrlForApi} from 'higherOrder/loadData/defaults';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import localStyles from './style.css';

const styles = foundationPartial(ebiStyles, interproStyles, localStyles);

class DynamicMenu extends Component {
  static propTypes = {
    data: T.object,
    loading: T.bool,
    pathname: T.string.isRequired,
  };

  static defaultProps = {
    data: null,
  };

  shouldComponentUpdate({loading}) {
    return !loading;
  }

  render() {
    const {pathname, data: {loading, payload}} = this.props;
    let Menu = EntitiesMenu;
    if (loading || !payload || pathname === '/') {
      Menu = InterproMenu;
    } else if (payload.metadata) {
      Menu = SingleEntityMenu;
    }
    return (
      <Menu
        data={payload}
        pathname={pathname}
        className={styles('menu', 'dynamic-menu')}
      />
    );
  }
}

// TODO: change logic for menu loading data
const urlBlacklist = new Set(['browse', 'search', 'settings', 'about', 'help']);
const getUrlFromState = ({settings, location}) => {
  for (const blacklist of urlBlacklist) {
    if (location.pathname.toLowerCase().includes(blacklist)) {
      return getUrlForApi({settings, location: {pathname: ''}});
    }
  }
  return getUrlForApi({settings, location});
};

export default loadData(getUrlFromState)(DynamicMenu);

