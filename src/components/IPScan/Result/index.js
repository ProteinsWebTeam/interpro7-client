import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import T from 'prop-types';

class IPScanResult extends PureComponent {
  render() {
    console.log(this.props);
    return <div>{this.props.matched}</div>;
  }
}

export default connect()(IPScanResult);
