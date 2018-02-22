import React, { PureComponent } from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { NumberComponent } from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { toPlural } from 'utils/pages';

import { speciesFeat } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import byX from '../styles.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, byX, local);

class Species extends PureComponent /*:: <SpeciesProps> */ {
  static propTypes = {
    species: T.object.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
  };

  render() {
    const { species, data: { loading, payload } } = this.props;
    let entries = 0;
    let proteins = 0;
    if (!loading && payload && payload.metadata) {
      entries = payload.metadata.counters.entries;
      proteins = payload.metadata.counters.proteins;
    }

    return (
      <div
        className={f('column', 'small-3', 'medium-2', 'large-4', 'text-center')}
        key={species.tax_id || 'unclassified'}
      >
        <Link
          to={{
            description: {
              main: { key: 'organism' },
              organism: {
                db: 'taxonomy',
                accession: species.tax_id,
              },
            },
          }}
        >
          <span
            style={{ color: species.color }}
            className={f('small', 'icon', 'icon-species')}
            data-icon={species.icon}
          />
          <h6>{species.title}</h6>
        </Link>
        <div className={f('list-detail')}>
          <Tooltip
            title={`${entries} ${toPlural('entry', entries)} matching ${
              species.title
            }`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: { db: 'taxonomy', accession: species.tax_id },
                  entry: { isFilter: true, db: 'all' },
                },
              }}
            >
              <NumberComponent loading={loading} value={entries} />{' '}
              {toPlural('entry', entries)}
            </Link>
          </Tooltip>
          <br />
          <Tooltip
            title={`${proteins} ${toPlural('protein', proteins)} matching ${
              species.title
            }`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: { db: 'taxonomy', accession: species.tax_id },
                  protein: { isFilter: true, db: 'UniProt' },
                },
              }}
            >
              <NumberComponent loading={loading} value={proteins} />{' '}
              {toPlural('protein', proteins)}
            </Link>
          </Tooltip>
        </div>
      </div>
    );
  }
}

const mapStateToUrlFor = accession =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname:
          root +
          descriptionToPath({
            main: { key: 'organism' },
            organism: { db: 'taxonomy', accession },
          }),
      }),
  );

/*:: type Props = {
  data: {
    loading: boolean,
    payload: ?Object,
  },
  dataEntry: {
    loading: boolean,
    payload: ?Object,
  }
}; */

class BySpecies extends PureComponent /*:: <Props> */ {
  render() {
    return (
      <div className={f('species-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {speciesFeat.map(species => {
            const { tax_id: taxID } = species;
            const SpeciesWithData = loadData(mapStateToUrlFor(taxID))(Species);
            return (
              <SpeciesWithData
                species={species}
                key={taxID || 'unclassified'}
              />
            );
          })}
        </AnimatedEntry>
        <Link
          to={{
            description: {
              main: { key: 'organism' },
              organism: { db: 'taxonomy' },
            },
          }}
          className={f('button')}
        >
          View all Organism
        </Link>
      </div>
    );
  }
}

export default BySpecies;
