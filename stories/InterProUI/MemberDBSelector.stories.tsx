import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { _MemberDBSelector as MemberDBSelector } from 'components/MemberDBSelector';

import Provider from '../Provider';
import configureStore from '../configureStore';
import { noop } from 'lodash-es';

const store = configureStore();

const meta = {
  title: 'InterPro UI/MemberDBSelector',
  component: MemberDBSelector,
  parameters: {
    layout: 'centered',
  },
  // TODO: Enable when MemberDBSelector gets migrated to TS to be able to include TS
  // tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof MemberDBSelector>;

export default meta;

const intialLocation = {
  description: {
    entry: {
      db: 'InterPro',
    },
    taxonomy: {
      isFilter: false,
    },
    main: {
      key: 'entry',
    },
  },
  search: {},
};

const dataDB = {
  loading: false,
  payload: {
    databases: {
      interpro: {
        canonical: 'interpro',
        name: 'InterPro',
        type: 'entry',
      },
      cdd: {
        canonical: 'cdd',
        name: 'CDD',
        type: 'entry',
      },
      pfam: {
        canonical: 'pfam',
        name: 'Pfam',
        type: 'entry',
      },
    },
  },
};

const dataDBCount = {
  loading: false,
  ok: true,
  payload: {
    entries: {
      all: 215965,
      integrated: 49513,
      interpro: 36651,
      unintegrated: 128272,
      member_databases: {
        cdd: 12779,
        pfam: 4397,
      },
    },
  },
};

type MemberDBSelectorStory = StoryObj<typeof meta>;

export const Base: MemberDBSelectorStory = {
  args: {
    contentType: 'entry',
    customLocation: intialLocation,
    dataDB: dataDB,
    dataDBCount: dataDBCount,
    lowGraphics: false,
    goToCustomLocation: { noop },
  },
};
export const AsSideMenu = () => {
  // local state emulating the location in the redux state
  const [location, setLocation] = useState(intialLocation);
  return (
    <MemberDBSelector
      contentType={'entry'}
      lowGraphics={false}
      goToCustomLocation={setLocation}
      customLocation={location}
      dataDB={dataDB}
      dataDBCount={dataDBCount}
    />
  );
};

export const AsSelect = () => {
  // local state emulating the location in the redux state
  const [location, setLocation] = useState(intialLocation);
  return (
    <MemberDBSelector
      contentType={'entry'}
      lowGraphics={false}
      goToCustomLocation={setLocation}
      customLocation={location}
      dataDB={dataDB}
      dataDBCount={dataDBCount}
    >
      {() => <button className={'button'}>Click to display</button>}
    </MemberDBSelector>
  );
};
