/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';
// import Switch from 'components/generic/Switch';

import Link from 'components/generic/Link';
import EntriesOnProtein from 'components/Matches/EntriesOnProtein';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';

import Related from 'components/Related';

const getUrl = end => ({
  settings: {api: {protocol, hostname, port, root}},
  location: {pathname},
}) => `${protocol}//${hostname}:${port}${root}${
  pathname.replace(/entry.*$/i, `entry/${end}`)
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

const mergeDataOld = (interpro, integrated) => {
  const output = {};
  for (const ipEntry of interpro) {
    output[ipEntry.accession] = [];
    for (const integratedEntry of (integrated || [])) {
      if (ipEntry.accession === integratedEntry.entry_integrated) {
        output[ipEntry.accession].push(integratedEntry);
      }
    }
  }
  return output;
};

let Index = class extends Component {
  static propTypes = {
    mainData: T.object.isRequired,
    dataInterPro: T.object.isRequired,
    dataIntegrated: T.object.isRequired,
  };

  componentWillMount() {
    loadWebComponent(
      () => import(
        /* webpackChunkName: "interpro-components" */'interpro-components'
      ).then(m => m.InterproType)
    ).as('interpro-type');
  }

  render() {
    const {mainData, dataInterPro, dataIntegrated} = this.props;
    if (dataInterPro.loading || dataIntegrated.loading) {
      return <div>Loading...</div>;
    }
    const data = mergeDataOld(
      dataInterPro.payload.entries,
      dataIntegrated.payload.entries
    );
    console.log(mergeData(
      dataInterPro.payload.entries,
      dataIntegrated.payload.entries
    ));
    const mainLength = mainData.payload.metadata.length;
    return (
      <div>
        <div style={{background: '#EEE'}}>
          <div>
            [placeholder Families]
          </div>
          <div>
            [placeholder Domains]
          </div>
          <div>
            [placeholder Unintegrated]
          </div>
          <div>
            [placeholder Per residue]
          </div>
        </div>
        <div>
          <ul>Detailed signature matches:
            {Object.entries(data).map(([accession, signatures]) => {
              const entry = dataInterPro.payload.entries.find(
                e => e.accession === accession
              );
              return (
                <li key={accession}>
                  <div>
                    <interpro-type type={entry.entry_type.replace('_', ' ')}>
                      {entry.entry_type}
                    </interpro-type>
                    <Link to={`/entry/${entry.source_database}/${accession}`}>
                      {accession.toUpperCase()}
                    </Link>
                  </div>
                  <svg
                    width={mainLength * 4}
                    viewBox={`0 0 ${mainLength} ${signatures.length * 7 + 2}`}
                    style={{background: 'lightgray'}}
                  >
                    {signatures.map((signature, i) => (
                      <g
                        key={signature.accession}
                        transform={`translate(0, ${i * 7 + 2})`}
                      >
                        {signature.entry_protein_coordinates.coordinates[0].map(
                          ([from, to]) => (
                            <rect
                              key={`${from}-${to}`}
                              x={from} y="0" rx="1" ry="1"
                              width={to - from + 1} height="5"
                              fill="white" stroke="black" strokeWidth="0.5"
                            />
                          )
                        )}
                      </g>
                    ))}
                  </svg>
                  {signatures.map(signature => {
                    const matches = [{
                      protein: mainData.payload.metadata,
                      entry: signature,
                    }];
                    return (
                      <div
                        key={signature.accession}
                        style={{display: 'flex', alignItems: 'center'}}
                      >
                        <EntriesOnProtein
                          matches={matches}
                          options={{scale: 4}}
                        />
                        ▸
                        <Link
                          to={`/entry/${
                            signature.source_database
                            }/${signature.accession}`}
                        >
                          {signature.accession}
                        </Link>
                      </div>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
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

const EntrySub = (
  {data, location: {pathname}, main}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <Related
      data={data}
      main={main}
      secondary="entry"
      pathname={pathname}
    />
    <Index mainData={data} />
  </div>
);
EntrySub.propTypes = {
  data: T.object.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  main: T.string.isRequired,
};

export default EntrySub;
