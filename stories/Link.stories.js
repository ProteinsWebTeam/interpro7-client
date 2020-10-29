import React, { useState } from 'react';
import Link, { _Link as RawLink } from 'components/generic/Link';

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

const initialLocation = {
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

export const InternalLink = () => {
  const [location, setLocation] = useState(initialLocation);
  return (
    <RawLink
      customLocation={location}
      to={initialLocation}
      goToCustomLocation={setLocation}
    >
      Kringle
    </RawLink>
  );
};
