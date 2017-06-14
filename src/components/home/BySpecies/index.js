// @flow
import React from 'react';
import T from 'prop-types';
import {format} from 'url';
import {createSelector} from 'reselect';

import {foundationPartial} from 'styles/foundation';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';

import {speciesFeat} from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../ByMemberDatabase/styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const BySpecies = ({data: {payload}}) => (
  <AnimatedEntry className={f('row')} element="div">
    {
      // TODO: Include number of entries
      speciesFeat.map((e, i) => (
        <div
          className={f('columns', 'medium-4', 'large-4', 'text-center')}
          key={i}
        >
          <Link to={`/protein/uniprot?tax_id=${e.tax_id}`}>
            <span
              style={{color: e.color}}
              className={f('small', 'icon', 'icon-species')}
              data-icon={e.icon} data-tooltip
            />
            <h6>
              {e.title}
            </h6>
            <p>{payload && payload[e.tax_id] ? payload[e.tax_id] : '...'} proteins
            </p>
          </Link>
        </div>
      ))
    }
  </AnimatedEntry>
);

BySpecies.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
};

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({protocol, hostname, port, root}) => format({
    protocol,
    hostname,
    port,
    pathname: `${root}/protein`,
    query: {group_by: 'tax_id'},
  })
);

export default loadData(mapStateToUrl)(BySpecies);
