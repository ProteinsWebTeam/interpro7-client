// @flow
import React, {PropTypes as T, Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';

import InterproMenu from 'components/Menu/InterproMenu';
import EntitiesMenu from 'components/Menu/EntitiesMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import localStyles from './style.css';

const styles = foundationPartial(ebiStyles, interproStyles, localStyles);

class DynamicMenu extends Component {
  static propTypes = {
    data: T.object,
    loading: T.bool.isRequired,
    location: T.shape({
      pathname: T.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    data: null,
  };

  shouldComponentUpdate({loading}) {
    return !loading;
  }

  render() {
    const {location: {pathname}, data} = this.props;
    let Menu = EntitiesMenu;
    if (!data || pathname === '/') {
      Menu = InterproMenu;
    } else if (data.metadata) {
      Menu = SingleEntityMenu;
    }
    return (
      <Menu
        data={data}
        pathname={pathname}
        className={styles('menu', 'dynamic-menu')}
      />
    );
  }
}

export default withRouter(
  connect(({data: {data, loading}}) => ({data, loading}))(DynamicMenu)
);

