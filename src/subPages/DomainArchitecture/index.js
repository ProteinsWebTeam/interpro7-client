/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';

import DomainArchitecture from 'components/Protein/DomainArchitecture';

const getUrl = end => ({
                         settings: {api: {protocol, hostname, port, root}},
                         location: {pathname},
                       }) => `${protocol}//${hostname}:${port}${root}${
  pathname
    .replace('domain_architecture', 'entry')
    .replace(/entry.*$/i, `entry/${end}`)
  }`;

const mergeData = (interpro, integrated) => {
  const ipro = {};
  const out = interpro.reduce((acc, val) => {
    val.signatures = [];
    ipro[val.accession] = val;
    if (!(val.entry_type in acc)) {
      acc[val.entry_type] = [];
    }
    acc[val.entry_type].push(val);
    return acc;
  }, {});
  for (const entry of integrated){
    if (entry.entry_integrated in ipro){
      ipro[entry.entry_integrated].signatures.push(entry);
    } else console.error('integrated entry without interpro:', entry);

  }
  return out;
};

let Index = class extends Component {
  static propTypes = {
    mainData: T.object.isRequired,
    dataInterPro: T.object.isRequired,
    dataIntegrated: T.object.isRequired,
  };

  render(){
    const {mainData, dataInterPro, dataIntegrated} = this.props;
    if (dataInterPro.loading || dataIntegrated.loading) {
      return <div>Loading...</div>;
    }
    const mergedData = mergeData(
      dataInterPro.payload.entries,
      dataIntegrated.payload.entries
    );
    return (
      <div style={{width: '98vw'}}>
        <DomainArchitecture protein={mainData.payload.metadata} data={mergedData} />
      </div>
    );
  }
};

Index = loadData({
  getUrl: getUrl('Integrated'),
  propNamespace: 'Integrated',
})(Index);
Index = loadData({
  getUrl: getUrl('InterPro'),
  propNamespace: 'InterPro',
})(Index);

const DomainSub = (
  {data}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <h3>{data.payload.metadata.accession}</h3>
    <Index mainData={data} />
  </div>
);
DomainSub.propTypes = {
  data: T.object.isRequired,
};

export default DomainSub;
