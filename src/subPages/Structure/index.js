/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import Related from 'components/Related';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import loadData from 'higherOrder/loadData';

import DomainArchitecture from 'components/Protein/DomainArchitecture';

const getUrlFor = createSelector(// this one only to memoize it
  db => db,
  db => createSelector(
    state => state.settings.api,
    state => state.location.pathname,
    ({protocol, hostname, port, root}, pathname) => {
      const newURL = (root + pathname)
          .replace('structure', 'entry')
          .replace(/entry.*$/i, `entry/${db}`);
      return resolve(
        format({protocol, hostname, port, pathname: root}),
        newURL,
      );
    }
  ),
);

const mergeData = (interpro, structures) => {
  const ipro = {};
  const out = interpro.reduce((acc, val) => {
    val.signatures = [];
    val.children = [];
    ipro[val.accession] = val;
    if (!(val.entry_type in acc)) {
      acc[val.entry_type] = [];
    }
    acc[val.entry_type].push(val);
    return acc;
  }, {});
  if (structures.length > 0) {
    out.structures = structures.map(({...obj}) => ({
      label: `${obj.accession}: ${obj.chain}`,
      ...obj,
    })).sort((a, b) => a.label > b.label);
  }
  return out;
};

let Index = class extends Component {
  static propTypes = {
    mainData: T.object.isRequired,
    dataInterPro: T.object,
  };

  render(){
    const {mainData, dataInterPro} = this.props;
    if (dataInterPro.loading) {
      return <div>Loading...</div>;
    }
    const mergedData = mergeData(
      dataInterPro.payload.entries,
      mainData.payload.structures,
    );
    return (
      <div>
        <DomainArchitecture protein={mainData.payload.metadata} data={mergedData} />
      </div>
    );
  }
};
Index = ['InterPro'].reduce(
  (Index, db) => loadData({
    getUrl: getUrlFor(db),
    propNamespace: db,
  })(Index), Index);

const StructureSub = (
  {data, location: {pathname}, main}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <Index mainData={data} />
    <Related
      data={data}
      main={main}
      secondary="structure"
      pathname={pathname}
    />
  </div>
);
StructureSub.propTypes = {
  data: T.object.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  main: T.string.isRequired,
};

export default StructureSub;
