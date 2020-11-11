/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link, { _Link as RawLink } from 'components/generic/Link';
import { noop } from 'lodash-es';

import Provider from './Provider';
import configureStore from './configuedStore.js';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

const store = configureStore();

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/Link',
  decorators: [withProvider],
};

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

export const Basic = () => (
  <>
    Visit
    <Link href="https://www.ebi.ac.uk/interpro"> Interpro</Link> /
    <Link href="https://www.ebi.ac.uk/" className={f('ext')} target={'_blank'}>
      {' '}
      EMBL-EBI
    </Link>
  </>
);

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
  const _ConnectedLinkComponent = ({ location }) => {
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
    (state) => state.customLocation,
    (location) => ({
      location,
    })
  );
  const ConnectedLinkComponent = connect(mapStateToProps)(
    _ConnectedLinkComponent
  );
  return <ConnectedLinkComponent />;
};
