import React from 'react';
import Link from 'components/generic/Link';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Provider from './Provider';
import configureStore from './configuedStore.js';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

const store = configureStore({
  pathname: '/entry/interpro/',
  search: '?page_size=2',
  hash: 'table',
});

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/Link',
  decorators: [withProvider],
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

// export const InternalLink = () => (
//   <Link
//     className={f('nolink')}
//     to={{
//       description: {
//         main: { key: 'entry' },
//         entry: { db: 'interpro'},
//       },
//       hash: 'table',
//     }}
//   >
//     Kringle
//   </Link>
// );
