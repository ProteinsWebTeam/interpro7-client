import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import Table, {
  Column,
  Card,
  PageSizeSelector,
  SearchBox,
  HighlightToggler,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import Provider from './Provider';
import configureStore from './configureStore';

const store = configureStore({
  pathname: '/protein/uniprot/',
  search: '?page_size=2',
  hash: 'table',
});

const meta = {
  title: 'InterPro UI/Table/Base',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type TableStory = StoryObj<typeof meta>;

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5, group: 'A group' },
  { id: 3, name: 'Third', extra: 0.75, group: 'B group' },
  { id: 4, name: 'Fourth', extra: 0.5, group: 'B group' },
];
export const TheTable: TableStory = {
  args: {
    actualSize: basicData.length,
    dataTable: basicData,
    children: [
      <Column dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>,
      <Column dataKey="name" headerStyle={{ top: 0 }}>
        Name
      </Column>,
      <Column
        dataKey="extra"
        headerStyle={{ top: 0 }}
        renderer={(extra: number) => <span>{extra * 100}%</span>}
      >
        Percentage
      </Column>,
    ],
  },
};

export const TheTableWithGroups: TableStory = {
  args: {
    actualSize: basicData.length,
    dataTable: basicData,
    shouldGroup: true,
    children: [
      <Column dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>,
      <Column dataKey="name" headerStyle={{ top: 0 }}>
        Name
      </Column>,
      <Column
        dataKey="extra"
        headerStyle={{ top: 0 }}
        renderer={(extra: number) => <span>{extra * 100}%</span>}
      >
        Percentage
      </Column>,
    ],
  },
};

type InnerProps = {
  data: Array<Record<string, unknown>>;
  search: Record<string, string | boolean>;
  totalLength: number;
  isSearchable?: boolean;
};
const NewTable = ({
  data,
  search,
  totalLength,
  isSearchable = false,
}: InnerProps) => {
  console.log({ isSearchable });
  return (
    <Table
      actualSize={totalLength}
      dataTable={data}
      query={search}
      title="The Connected Table"
      showTableIcon={false}
    >
      <PageSizeSelector />
      {isSearchable && <SearchBox loading={false}>Search</SearchBox>}
      {isSearchable && <HighlightToggler />}
      <Column dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>
      <Column
        dataKey="name"
        headerStyle={{ top: 0 }}
        renderer={(name: string) => (
          <HighlightedText text={name} textToHighlight={search.search} />
        )}
      >
        Name
      </Column>
    </Table>
  );
};

export const TheConnectedTable: TableStory = {
  args: {
    actualSize: basicData.length,
    dataTable: basicData,
  },
  render: (args) => {
    const mapStateToProps = createSelector(
      (state: GlobalState) => state.customLocation.search,
      (state: GlobalState) => state.settings.navigation.pageSize,
      (search, pageSize) => {
        const size = Number(search.page_size || pageSize);
        const page = Number(search?.page || 1);
        const data: Array<Record<string, unknown>> = args.dataTable.slice(
          (page - 1) * size,
          page * size
        );
        return { data, search, totalLength: basicData.length };
      }
    );

    const ConnectedTable = connect(mapStateToProps)(NewTable);
    return <ConnectedTable />;
  },
};

export const TheSearchableTable: TableStory = {
  args: {
    actualSize: basicData.length,
    dataTable: basicData,
  },
  render: (args) => {
    const mapStateToProps = createSelector(
      (state: GlobalState) => state.customLocation.search,
      (state: GlobalState) => state.settings.navigation.pageSize,
      (search, pageSize) => {
        const size = Number(search.page_size || pageSize);
        const page = Number(search?.page || 1);
        const filteredData: Array<Record<string, unknown>> = search?.search
          ? args.dataTable.filter(({ name }: { name: string }) =>
              name.includes(search.search as string)
            )
          : args.dataTable;
        const data = filteredData.slice((page - 1) * size, page * size);
        return { data, search, totalLength: basicData.length };
      }
    );

    const ConnectedTable = connect(mapStateToProps)(NewTable);
    return <ConnectedTable isSearchable={true} />;
  },
};
