import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import NumberComponent from 'components/NumberComponent';

import { toPlural } from 'utils/pages';
import { speciesFeat } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import byX from '../styles.css';
import local from './styles.css';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, byX, local);

export class Species extends PureComponent {
  static propTypes = {
    species: T.object.isRequired,
    entries: T.oneOfType([T.number, T.string]),
    proteins: T.oneOfType([T.number, T.string]),
    loading: T.bool,
  };

  render() {
    const { species, entries = 0, proteins = 0, loading = true } = this.props;

    return (
      <div
        className={f('column', 'small-3', 'medium-2', 'large-4', 'text-center')}
        key={species.proteome_id || 'unclassified'}
        data-testid="by-species-box"
      >
        <Link
          to={{
            description: {
              main: { key: 'proteome' },
              proteome: {
                db: 'uniprot',
                accession: species.proteome_id,
              },
            },
          }}
          data-testid={`species-${species.proteome_id}`}
        >
          <span
            style={{ color: species.color }}
            className={f('small', 'icon', 'icon-species')}
            data-icon={species.icon}
          />
          <br />
          <span className={f('title')}>{species.title}</span>
        </Link>
        <div className={f('list-detail')}>
          <p>
            <Link
              to={{
                description: {
                  main: { key: 'proteome' },
                  proteome: {
                    db: 'uniprot',
                    accession: species.proteome_id,
                  },
                  entry: { isFilter: true, db: 'all' },
                },
              }}
            >
              <NumberComponent
                loading={loading}
                abbr
                titleType={`${toPlural('entry', entries)} matching ${
                  species.title
                }`}
              >
                {entries}
              </NumberComponent>{' '}
              {toPlural('entry', entries)}
            </Link>
            <br />
            <Link
              to={{
                description: {
                  main: { key: 'proteome' },
                  proteome: {
                    db: 'uniprot',
                    accession: species.proteome_id,
                  },
                  protein: { isFilter: true, db: 'UniProt' },
                },
              }}
              disabled={!proteins}
            >
              <NumberComponent
                loading={loading}
                abbr
                titleType={`${toPlural('protein', proteins)} matching ${
                  species.title
                }`}
              >
                {proteins}
              </NumberComponent>{' '}
              {toPlural('protein', proteins)}
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export class BySpecies extends PureComponent {
  static propTypes = {
    api: T.object.isRequired,
  };

  state = {
    speciesData: {},
    loading: true,
  };

  async componentDidMount() {
    const { protocol, hostname, port, root } = this.props.api;

    const speciesData = {};
    await Promise.all(
      speciesFeat.map(async (species) => {
        const description = {
          main: { key: 'proteome' },
          proteome: {
            db: 'uniprot',
            accession: species.proteome_id,
          },
          protein: { db: 'UniProt' },
        };

        const response = await fetch(
          format({
            protocol,
            hostname,
            port,
            pathname: root + descriptionToPath(description),
          }),
        );
        const data = await response.json();

        speciesData[species.proteome_id] = {
          entries: data.metadata.counters.entries,
          proteins: data.metadata.counters.proteins,
        };
      }),
    );

    this.setState({ speciesData, loading: false });
  }

  render() {
    const { speciesData, loading } = this.state;

    return (
      <div className={f('species-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {speciesFeat
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((species) => (
              <Species
                key={species.proteome_id || 'unclassified'}
                species={species}
                loading={loading}
                entries={speciesData[species.proteome_id]?.entries || 0}
                proteins={speciesData[species.proteome_id]?.proteins || 0}
              />
            ))}
        </AnimatedEntry>
        <Link
          to={{
            description: {
              main: { key: 'proteome' },
              proteome: { db: 'uniprot' },
            },
          }}
          buttonType="primary"
        >
          Browse all species
        </Link>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.api,
  (api) => ({
    api,
  }),
);

export default connect(mapStateToProps)(BySpecies);
