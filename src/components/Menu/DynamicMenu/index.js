// @flow
import React, {PropTypes as T, Component} from 'react';
import {withRouter} from 'react-router/es';
import {connect} from 'react-redux';

import InterproMenu from 'components/Menu/InterproMenu';
import EntitiesMenu from 'components/Menu/EntitiesMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';

const styles = foundationPartial(ebiStyles, interproStyles);

class DynamicMenu extends Component {
  /* ::
    state: {
      data: ?Object,
    };
  */
  static propTypes = {
    data: T.object.isRequired,
    loading: T.bool.isRequired,
    location: T.shape({
      pathname: T.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    data: null,
  };

  constructor() {
    super();
    this.state = {data: null};
  }

  componentWillMount() {
    if (!this.props.loading) {
      this.setState({data: this.props.data});
    }
  }

  componentWillReceiveProps({data, loading}) {
    if (!loading) this.setState({data});
  }

  render() {
    const {location: {pathname}} = this.props;
    const {data} = this.state;
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
  }
}

export default withRouter(
  connect(({data: {data, loading}}) => ({data, loading}))(DynamicMenu)
);

