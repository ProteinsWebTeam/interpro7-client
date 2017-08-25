// @flow
import React from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';

import { speciesFeat } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import byX from '../styles.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, byX, local);

const BySpecies = ({ data: { payload }, dataEntry: { payload: payloadE } }) =>
  <div className={f('species-list')}>
    <AnimatedEntry className={f('row')} element="div">
      {// TODO: Include number of entries
      // The result in the tab counts the number of proteins.
      // This comes from a /proteins?group_by=tax_id
      // A similar query but for entries needs to be supported in the API.
      // Once there an update of this component is required
      speciesFeat.map(e =>
        <div
          className={f(
            'column',
            'small-3',
            'medium-2',
            'large-4',
            'text-center',
          )}
          key={e.tax_id}
        >
          <span
            style={{ color: e.color }}
            className={f('small', 'icon', 'icon-species')}
            data-icon={e.icon}
            data-tooltip
          />
          <h6>
            {e.title}
          </h6>
          <p>
            <Link
              newTo={location => ({
                description: {
                  mainType: 'entry',
                  mainDB: 'interpro',
                  // TODO: uncomment when the client supports organism as an endpoint
                  // focusType: 'organism',
                  // focusDB: 'taxonomy',
                  // focusAccession: e.tax_id,
                },
                hash: location.hash,
              })}
            >
              {payloadE && payloadE[e.tax_id] ? payloadE[e.tax_id] : '...'}{' '}
              entries
            </Link>
            <br />
            <Link
              newTo={location => ({
                description: { mainType: 'protein', mainDB: 'uniprot' },
                search: {
                  ...location.search,
                  tax_id: e.tax_id,
                },
                hash: location.hash,
              })}
            >
              {payload && payload[e.tax_id] ? payload[e.tax_id] : '...'}{' '}
              proteins
            </Link>
          </p>
        </div>,
      )}
    </AnimatedEntry>
  </div>;

BySpecies.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
  dataEntry: T.shape({
    payload: T.object,
  }).isRequired,
};

const mapStateToUrl = endpoint =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/${endpoint}`,
        query: { group_by: 'tax_id' },
      }),
  );

export default loadData({
  getUrl: mapStateToUrl('entry'),
  propNamespace: 'Entry',
})(loadData(mapStateToUrl('protein'))(BySpecies));
