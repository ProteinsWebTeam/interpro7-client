import React, { useState } from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { _MemberDBSelector as MemberDBSelector } from '../src/components/MemberDBSelector';

import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore();

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI.MemberDBSelector',
  decorators: [withProvider, withKnobs],
};

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
export const AsSideMenu = () => {
  // local state emulating the location in the redux state
  const [location, setLocation] = useState(intialLocation);
  return (
    <MemberDBSelector
      contentType={'entry'}
      lowGraphics={boolean('lowGraphics', false)}
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
      lowGraphics={boolean('lowGraphics', false)}
      goToCustomLocation={setLocation}
      customLocation={location}
      dataDB={dataDB}
      dataDBCount={dataDBCount}
    >
      {() => <button className={'button'}>Click to display</button>}
    </MemberDBSelector>
  );
};
