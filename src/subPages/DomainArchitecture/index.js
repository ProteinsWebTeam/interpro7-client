import React, { Component } from 'react';
import T from 'prop-types';

import DomainsOnProtein from 'components/Related/DomainsOnProtein';

const DomainSub = ({ data }) =>
  /*: {data: Object, location: {pathname: string}, main: string} */
  <div>
    <h3>
      {data.payload.metadata.accession}
    </h3>
    <DomainsOnProtein mainData={data} />
  </div>;
DomainSub.propTypes = {
  data: T.object.isRequired,
};

export default DomainSub;
