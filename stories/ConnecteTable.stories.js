import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Table, { Column, Card, PageSizeSelector } from 'components/Table';

import Provider from './Provider';
import configureStore from './configuedStore.js';

import { foundationPartial } from '../src/styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(ebiStyles, fonts);

const store = configureStore({
  pathname: '/protein/uniprot/',
  search: '?page_size=2',
  hash: 'table',
});
const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/Table/Base',
  decorators: [withProvider],
};

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5 },
  { id: 3, name: 'Third', extra: 0.75 },
  { id: 4, name: 'Fourth', extra: 0.5 },
];

// eslint-disable-next-line react/prop-types
const CardForStory = ({ id, name, extra }) => (
  <div
    className={f('flex-card')}
    style={{ width: '300px', textAlign: 'center' }}
  >
    <div className={f('card-title')}>
      <h6>
        {id} - {name}
      </h6>
    </div>
    <div>{extra * 100}%</div>
  </div>
);

export const TheTable = () => (
  <Table actualSize={basicData.length} dataTable={basicData}>
    <Column dataKey="id" headerStyle={{ top: 0 }}>
      ID
    </Column>
    <Column dataKey="name" headerStyle={{ top: 0 }}>
      Name
    </Column>
    <Column
      dataKey="extra"
      headerStyle={{ top: 0 }}
      renderer={(extra) => <span>{extra * 100}%</span>}
    >
      Percentage
    </Column>
  </Table>
);

export const TheCardTable = () => (
  <Table actualSize={basicData.length} dataTable={basicData}>
    <Card>{(data) => <CardForStory {...data} />}</Card>
    <Column dataKey="id" headerStyle={{ top: 0 }}>
      ID
    </Column>
    <Column dataKey="name" headerStyle={{ top: 0 }}>
      Name
    </Column>
    <Column
      dataKey="extra"
      headerStyle={{ top: 0 }}
      renderer={(extra) => <span>{extra * 100}%</span>}
    >
      Percentage
    </Column>
  </Table>
);

export const TheConnectedTable = () => {
  // eslint-disable-next-line react/prop-types
  const NewTable = ({ data, search, totalLength }) => (
    <Table
      actualSize={totalLength}
      dataTable={data}
      query={search}
      title="The Connected Table"
      showTableIcon={false}
    >
      <PageSizeSelector />
      <Column dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>
      <Column dataKey="name" headerStyle={{ top: 0 }}>
        Name
      </Column>
      <Column
        dataKey="extra"
        headerStyle={{ top: 0 }}
        renderer={(extra) => <span>{extra * 100}%</span>}
      >
        Percentage
      </Column>
    </Table>
  );
  const mapStateToProps = createSelector(
    (state) => state.customLocation.search,
    (state) => state.settings.navigation.pageSize,
    (search, pageSize) => {
      const size = search.page_size || pageSize;
      const page = search?.page || 1;
      const data = basicData.slice((page - 1) * size, page * size);
      return { data, search, totalLength: basicData.length };
    }
  );

  const ConnectedTable = connect(mapStateToProps)(NewTable);
  return <ConnectedTable />;
};
