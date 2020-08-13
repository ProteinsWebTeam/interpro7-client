/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import Table, {
  Column,
  Card,
  PageSizeSelector,
  SearchBox,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import Provider from './Provider';
import configureStore from './configuedStore.js';

import { foundationPartial } from 'styles/foundation';
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

export const TheConnectedCardTable = () => {
  const CardForStory = ({ id, name, extra }) => (
    <>
      <div className={f('card-header')}>
        {id} - {name}
      </div>
      <div className={f('card-content')}>
        <div className={f('card-info')}>{extra * 100}%</div>
      </div>
    </>
  );
  const CardTable = ({ description, hash, goToCustomLocation }) => {
    // Forcing to open the grid view
    if (hash !== 'grid')
      goToCustomLocation({
        description,
        hash: 'grid',
      });
    return (
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
  };
  const mapStateToProps = createSelector(
    (state) => state.customLocation.description,
    (state) => state.customLocation.hash,
    (description, hash) => ({ description, hash })
  );

  const ConnectedCardTable = connect(mapStateToProps, {
    goToCustomLocation,
  })(CardTable);
  return <ConnectedCardTable />;
};

export const TheConnectedTable = () => {
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
export const TheSearchableTable = () => {
  const NewTable = ({ data, search, totalLength }) => (
    <Table
      actualSize={totalLength}
      dataTable={data}
      query={search}
      title="The Connected Table"
      showTableIcon={false}
    >
      <PageSizeSelector />
      <SearchBox loading={false} highlightToggler={true}>
        Search
      </SearchBox>
      <Column dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>
      <Column
        dataKey="name"
        headerStyle={{ top: 0 }}
        renderer={(name) => (
          <HighlightedText text={name} textToHighlight={search.search} />
        )}
      >
        Name
      </Column>
    </Table>
  );
  const mapStateToProps = createSelector(
    (state) => state.customLocation.search,
    (state) => state.settings.navigation.pageSize,
    (search, pageSize) => {
      const size = search.page_size || pageSize;
      const page = search?.page || 1;
      const filteredData = search?.search
        ? basicData.filter(({ name }) => name.includes(search.search))
        : basicData;

      const data = filteredData.slice((page - 1) * size, page * size);
      return { data, search, totalLength: basicData.length };
    }
  );

  const ConnectedTable = connect(mapStateToProps)(NewTable);
  return <ConnectedTable />;
};
