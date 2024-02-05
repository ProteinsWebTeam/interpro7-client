import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { noop } from 'lodash-es';

import Link, { _Link as RawLink } from 'components/generic/Link';
import Provider from '../Provider';
import configureStore from '../configureStore';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(ipro);

const store = configureStore();

const meta = {
  title: 'InterPro UI/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  // TODO: Enable when Link gets migrated to TS to be able to include TS
  // tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof Link>;

export default meta;
type LinkStory = StoryObj<typeof meta>;

const newLocation = {
  description: {
    entry: {
      db: 'InterPro',
      accession: 'IPR000001',
    },
    main: {
      key: 'entry',
    },
  },
  search: {},
  hash: '',
};

export const Base: LinkStory = {
  args: {
    href: 'https://www.ebi.ac.uk/interpro',
    children: 'Interpro',
  },
};
export const ExternalLink: LinkStory = {
  args: {
    href: 'https://www.ebi.ac.uk/',
    className: css('ext-link'),
    target: '_blank',
    children: 'EMBL-EBI',
  },
};

export const UnconnectedLink = () => {
  const [location, setLocation] = useState({});
  return (
    <>
      <RawLink
        closeEverything={noop}
        to={newLocation}
        goToCustomLocation={setLocation}
      >
        Kringle
      </RawLink>
      <hr />
      <div>
        <h3>Current Location</h3>
        <pre>
          <code>{JSON.stringify(location, null, ' ')}</code>
        </pre>
      </div>
    </>
  );
};

export const ConnectedLink = () => {
  const _ConnectedLinkComponent = ({
    location,
  }: {
    location: InterProLocation;
  }) => {
    return (
      <>
        <Link to={newLocation}>Kringle</Link>
        <hr />
        <div>
          <h3>Current Location</h3>
          <pre>
            <code>{JSON.stringify(location, null, ' ')}</code>
          </pre>
        </div>
      </>
    );
  };
  const mapStateToProps = createSelector(
    (state: GlobalState) => state.customLocation,
    (location) => ({ location })
  );
  const ConnectedLinkComponent = connect(mapStateToProps)(
    _ConnectedLinkComponent
  );
  return <ConnectedLinkComponent />;
};
