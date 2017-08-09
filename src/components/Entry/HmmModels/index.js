/**
 * Created by maq on 07/08/2017.
 */
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import Link from 'components/generic/Link';

const HmmModelSection = function(data) {
  var temp = data;
  debugger;
  return (
    <div>
      <h1>Hmm Models</h1>
      <div className="content">
        <div className="logo_wrapper clearfix">
          <div className="logo" id="logo" data-logo={data.logo} />
        </div>
      </div>
    </div>
  );
};

export default HmmModelSection;
