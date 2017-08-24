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
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const BySpecies = ({ data: { payload } }) =>
  <div className={f('species-list')}>
    <AnimatedEntry className={f('row')} element="div">
      {// TODO: Include number of entries
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
          <Link
            newTo={location => ({
              description: {
                mainType: 'protein',
                mainDB: 'uniprot',
              },
              search: {
                ...location.search,
                tax_id: e.tax_id,
              },
              hash: location.hash,
            })}
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
              {payload && payload[e.tax_id] ? payload[e.tax_id] : '...'}{' '}
              proteins
            </p>
          </Link>
        </div>,
      )}
    </AnimatedEntry>;
  </div>;

BySpecies.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
};

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/protein`,
      query: { group_by: 'tax_id' },
    }),
);

export default loadData(mapStateToUrl)(BySpecies);
