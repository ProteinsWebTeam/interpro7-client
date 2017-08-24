/**
 * Created by maq on 07/08/2017.
 */
import React, { Component } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Link from 'components/generic/Link';
import hmm_logo from './hmm_logo';
import styles from './logo.css';

class LogoSection extends Component {
  static propTypes = {
    data: T.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  componentDidMount() {
    let logo = document.getElementById('logo');
    hmm_logo(logo, { column_info: true });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    //this.ec.destructor();
  }

  render() {
    let data_string = JSON.stringify(this.state.data);
    return <div className={styles.logo} id="logo" data-logo={data_string} />;
  }
}

const HmmModelSection = function(data) {
  return (
    <div className={styles.content}>
      <div className={classNames(styles.logo_wrapper, 'clearfix')}>
        <LogoSection data={data.logo} />
      </div>
    </div>
  );
};

export default HmmModelSection;
