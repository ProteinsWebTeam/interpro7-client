import React, { Component } from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import hmmLogo from './hmm_logo';

import { foundationPartial } from 'styles/foundation';

import styles from './logo.css';

const f = foundationPartial(styles);

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
    return <div className={f('logo')} ref={node => (this._node = node)} />;
  }
}

const HmmModelSection = ({ logo }) => (
  <div className={f('row')}>
    <div className={f('columns')}>
      <div className={f('logo_wrapper')}>
        <LogoSection data={logo} />
      </div>
    </div>
  </div>
);
HmmModelSection.propTypes = {
  logo: T.object.isRequired,
};

export default HmmModelSection;
