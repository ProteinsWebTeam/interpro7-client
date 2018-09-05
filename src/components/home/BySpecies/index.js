import React, { PureComponent } from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import NumberComponent from 'components/NumberComponent';

import loadData from 'higherOrder/loadData';
import { toPlural } from 'utils/pages';

import { speciesFeat } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import byX from '../styles.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, byX, local);

class Species extends PureComponent /*:: <SpeciesProps> */ {
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
        key={species.tax_id || 'unclassified'}
      >
        <Link
          to={{
            description: {
              main: { key: 'taxonomy' },
              taxonomy: {
                db: 'uniprot',
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
          <br />
          <span className={f('card-title')}>{species.title}</span>
        </Link>
        <div className={f('list-detail')}>
          <p>
            <Link
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: {
                    db: 'uniprot',
                    accession: species.tax_id,
                  },
                  entry: { isFilter: true, db: 'all' },
                },
              }}
            >
              <NumberComponent
                loading={loading}
                value={entries}
                abbr
                titleType={`${toPlural('entry', entries)} matching ${
                  species.title
                }`}
              />{' '}
              {toPlural('entry', entries)}
            </Link>
            <br />
            <Link
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: {
                    db: 'uniprot',
                    accession: species.tax_id,
                  },
                  protein: { isFilter: true, db: 'UniProt' },
                },
              }}
              disabled={!proteins}
            >
              <NumberComponent
                loading={loading}
                value={proteins}
                abbr
                titleType={`${toPlural('protein', proteins)} matching ${
                  species.title
                }`}
              />{' '}
              {toPlural('protein', proteins)}
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

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
  static propTypes = {
    data: T.object,
    dataProtein: T.object,
  };

  render() {
    const countsE = this.props.data.payload;
    const countsP = this.props.dataProtein.payload;
    const loading = this.props.data.loading && this.props.dataProtein.loading;
    return (
      <div className={f('species-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {speciesFeat
            .sort((a, b) => {
              // sort list by alphabetical order
              if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
              if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
              return 0;
            })
            .map(species => {
              const { tax_id: taxID } = species;
              return (
                <Species
                  species={species}
                  key={taxID || 'unclassified'}
                  loading={loading}
                  entries={
                    loading
                      ? '...'
                      : countsE && countsE[taxID] && countsE[taxID].value
                  }
                  proteins={
                    loading
                      ? '...'
                      : countsP && countsP[taxID] && countsP[taxID].value
                  }
                />
              );
            })}
        </AnimatedEntry>
        <Link
          to={{
            description: {
              main: { key: 'taxonomy' },
              taxonomy: { db: 'uniprot' },
            },
          }}
          className={f('button', 'margin-bottom-none', 'margin-top-large')}
        >
          View all Taxa
        </Link>
      </div>
    );
  }
}

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
  getUrl: mapStateToUrl('protein'),
  propNamespace: 'Protein',
})(loadData(mapStateToUrl('entry'))(BySpecies));
