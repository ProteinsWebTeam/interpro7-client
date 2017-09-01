import React, { Component } from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import hmmLogo from './hmm_logo';

import styles from './logo.css';

class LogoSection extends Component {
  static propTypes = {
    data: T.object,
  };

  componentDidMount() {
    hmmLogo(this._node, { column_info: true, data: this.props.data });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    // this.ec.destructor();
  }

  render() {
    return <div className={styles.logo} ref={node => (this._node = node)} />;
  }
}

const HmmModelSection = ({ logo }) => (
  <div className={styles.content}>
    <div className={classNames(styles.logo_wrapper, 'clearfix')}>
      <LogoSection data={logo} />
    </div>
  </div>
);
HmmModelSection.propTypes = {
  logo: T.object.isRequired,
};

export default HmmModelSection;
