import React, { useState } from 'react';
import Link from 'components/generic/Link';

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
  // TODO yet to be fixed
  const [location, setLocation] = useState(initialLocation);
  return (
    <Link customLocation={location} to={initialLocation}>
      Kringle
    </Link>
  );
};
