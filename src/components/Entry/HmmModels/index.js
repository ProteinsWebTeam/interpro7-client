/**
 * Created by maq on 07/08/2017.
 */
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import Link from 'components/generic/Link';
import hmm_logo from './hmm_logo';

const $ = require('./jquery');
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
    var logo = $('#logo');
    $('#logo').hmm_logo();
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
  const cleafix_class = 'clearfix';
  return (
    <div className={styles.content}>
      <div className={styles.logo_wrapper + ' ' + cleafix_class}>
        <LogoSection data={data.logo} />
      </div>
    </div>
  );
};

export default HmmModelSection;
