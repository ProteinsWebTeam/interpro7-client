import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { toPlural } from 'utils/pages';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import MemberSymbol from 'components/Entry/MemberSymbol';
import { NumberComponent } from 'components/NumberLabel';
import { ParagraphWithCites } from 'components/Description';
import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

const getUrlForOrg = (accession, db) =>
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
            entry: { isFilter: true, db: db },
            protein: { isFilter: true },
            organism: { db: 'taxonomy', accession },
          }),
      }),
  );

const getUrlForStruct = (accession, db) =>
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
            main: { key: 'structure' },
            structure: { db: 'pdb', accession },
            entry: {
              isFilter: true,
              db: db,
            },
          }),
      }),
  );

const getUrlForStructTaxname = accession =>
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
            organism: {
              db: 'taxonomy',
            },
            structure: {
              isFilter: true,
              db: 'pdb',
              accession: accession,
            },
          }),
      }),
  );

const getUrlFor = accession =>
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

const getUrlForEntries = (accession, db) =>
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
            main: { key: 'entry' },
            entry: { db: db, accession },
          }),
      }),
  );

const getSuperKingdom = (lineage /*: string */) => {
  if (lineage.includes(' 2759 ')) return 'Eukaryota';
  if (lineage.includes(' 2157 ')) return 'Archaea';
  if (lineage.includes(' 10239 ')) return 'Viruses';
  if (lineage.includes(' 12884 ')) return 'Viroids';
  if (lineage.includes(' 2 ')) return 'Bacteria';
};

const getNodespot = (lineage /*: string */) => {
  if (lineage.includes(' 1224 ')) return 'Proteobacteria';
  if (lineage.includes(' 201174 ')) return 'Actinobacteria';
  if (lineage.includes(' 203691 ')) return 'Spirochaetes';
  if (lineage.includes(' 203682 ')) return 'Planctomycetes';
  if (lineage.includes(' 1239 ')) return 'Firmicutes';
  if (lineage.includes(' 976 ')) return 'Bacteroidetes';
  if (lineage.includes(' 40674 ')) return 'Mammalia';
  if (lineage.includes(' 6656 ')) return 'Arthropoda';
  if (lineage.includes(' 33090 ')) return 'Viridiplantae';
  if (lineage.includes(' 6231 ')) return 'Nematoda';
  if (lineage.includes(' 8782 ')) return 'Birds';
  if (lineage.includes(' 4751 ')) return 'Fungi';
  if (lineage.includes(' 32561 ')) return 'Sauria';
  if (lineage.includes(' 7898 ')) return 'Fish';
};

class Lineage extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      data: { loading, payload },
    } = this.props;
    if (loading || !payload) return null;
    const { lineage } = payload.metadata;
    const superkingdom = getSuperKingdom(lineage) || 'N/A';
    const nodespot = getNodespot(lineage);

    return (
      <Tooltip title={`Lineage: ${payload.metadata.lineage}`}>
        {superkingdom} {nodespot && `(${nodespot})`}
      </Tooltip>
    );
  }
}

class SpeciesIcon extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      data: { loading, payload },
    } = this.props;
    const linetree = `${loading ? 0 : payload.metadata.lineage}`;
    let icon = null;
    let nodecolor = null;

    // key species in Interpro & EBI
    if (linetree.includes(' 121221 ')) {
      /* Node Pediculidae (body lice, includes 121224 Pediculus humanus subsp. corporis (louse)*/
      icon = '4';
    } else if (linetree.includes(' 34735 ')) {
      /* Node Apoidea (bees)*/
      icon = '$';
    } else if (linetree.includes(' 6855 ')) {
      /* Node Scorpiones (Scorpion)*/
      icon = 's';
    } else if (linetree.includes(' 6935 ')) {
      /* Node Ixodida (Ticks)*/
      icon = '&';
    } else if (linetree.includes(' 6448 ')) {
      /* Node Gastropoda (Snail)*/
      icon = "'";
    } else if (linetree.includes(' 28376 ')) {
      /* Node anolis*/
      icon = '7';
    } else if (linetree.includes(' 9681 ')) {
      /* Node felidae (includes 9685 Felis catus) */
      icon = 'A';
    } else if (linetree.includes(' 9606 ')) {
      /* homo*/
      icon = 'H';
    } else if (linetree.includes(' 3702 ')) {
      /* Mouse-ear cress */
      icon = 'B';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 6231 ')) {
      /* Node Nematoda (includes 6239 Caenorhabditis elegans) */
      icon = 'W';
    } else if (linetree.includes(' 9031 ')) {
      /* Gallus gallus (Chicken) */
      icon = 'k';
    } else if (linetree.includes(' 9922 ')) {
      /* Node Capra (includes 9925 Capra hircus goat)*/
      icon = 'm';
    } else if (linetree.includes(' 55153 ')) {
      /* Node Sciuridae (Squirrels)*/
      icon = 'I';
    } else if (linetree.includes(' 9723 ')) {
      /* Node Platanistidae (Dolphin)*/
      icon = 'D';
    } else if (linetree.includes(' 8292 ')) {
      /* Node Amphibia */
      icon = 'f';
    } else if (linetree.includes(' 8782 ')) {
      /* Node Bird (Finch)*/
      icon = 'n';
    } else if (linetree.includes(' 7157 ')) {
      /* subNode Culicidae (Mosquito) */
      icon = '1';
    } else if (linetree.includes(' 7147 ')) {
      /* Node Diptera (includes 7227 drosophila melanogaster)- WARNING HAS TO BE AFTER Mosquitoe node*/
      icon = 'F';
    } else if (linetree.includes(' 6656 ')) {
      /* Node Arthropoda (Spider)*/
      icon = 'S';
    } else if (linetree.includes(' 1639119 ')) {
      /* Node Plasmodium (Plasmodiidae)*/
      icon = '@';
    } else if (linetree.includes(' 7955 ')) {
      /* Zebrafish */
      icon = 'Z';
    } else if (linetree.includes(' 31031 ')) {
      /* Node Tetraodontidae (puffers) (includes 31033 Takifugu rubripes) */
      icon = 'E';
    } else if (linetree.includes(' 7898 ')) {
      /* Node Fish (7898 Actinopterygii NOT 7776 Gnathostomata includes mammals -  NOT 7777 Chondrichthyes)*/
      icon = 'Z';
    } else if (linetree.includes(' 10088 ')) {
      /* Node Mouse (includes 10090 Mus musculus)*/
      icon = 'M';
    } else if (linetree.includes(' 9368 ')) {
      /* Node Erinaceidae (Hedgehog)*/
      icon = 'o';
    } else if (linetree.includes(' 10114 ')) {
      /* Node Rattus (includes 10116 Rattus norvegicus)*/
      icon = 'R';
    } else if (linetree.includes(' 9615 ')) {
      /* Canis lupus familiaris (Dog)*/
      icon = 'd';
    } else if (linetree.includes(' 27592 ')) {
      /* Node Bovinae (includes Bos taurus (Bovine) 9913)*/
      icon = 'C';
    } else if (linetree.includes(' 9779 ')) {
      /* Node Proboscidea (elephants) (inludes 9783 Indian Elephant)*/
      icon = 'e';
    } else if (linetree.includes(' 9935 ')) {
      /* Node Ovis (includes 9940 Sheep) */
      icon = 'x';
    } else if (linetree.includes(' 9979 ')) {
      /* Node Leporidae (includes Oryctolagus cuniculus (Rabbit) 9986*/
      icon = 't';
    } else if (linetree.includes(' 9821 ')) {
      /*  Suidae (Pig)*/
      icon = 'p';
    } else if (linetree.includes(' 10140 ')) {
      /* Node Cavia (includes 10141 Cavia porcellus (Guinea pig))*/
      icon = 'g';
    } else if (linetree.includes(' 9265 ')) {
      /*  Node Didelphidae (opossums) (icnludes 126299 Monodelphis emiliae (Emilia's short-tailed opossum)*/
      icon = '9';
    } else if (linetree.includes(' 9554 ')) {
      /* Node Papio (includes 9555 Papio anubis (Olive baboon))*/
      icon = '8';
    } else if (linetree.includes(' 9596 ')) {
      /* Node Pan (chimpanzees) (includes 9598 Pan troglodytes)*/
      icon = 'i';
    } else if (linetree.includes(' 9539 ')) {
      /* Node Macaca (includes 9544 Macaca mulatta (Rhesus macaque)*/
      icon = 'r';
    } else if (linetree.includes(' 9397 ')) {
      /* Node Chiroptera (bats) (includes 9430 Desmodus rotundus (Vampire bat)*/
      icon = '(';
    } else if (linetree.includes(' 9599 ')) {
      /* Node Pongo (orangutan)*/
      icon = '*';
    } else if (linetree.includes(' 9592 ')) {
      /* Node Gorilla*/
      icon = 'G';
    } else if (linetree.includes(' 4932 ') || linetree.includes('4894')) {
      /* Saccharomyces cerevisiae (Baker's yeast) or Schizosaccharomycetaceae (fission yeasts)*/
      icon = 'Y';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 2157 ')) {
      /* Archaea*/
      icon = 'L';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 2 ')) {
      /* Node Bacteria (Ecoli)*/
      icon = 'L';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 10239 ')) {
      /* Node Virus */
      icon = 'v';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 4751 ')) {
      /* Node Fungus*/
      icon = 'u';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 4527 ')) {
      /* Node Oryza (includes 4530 (Oriza sativa))*/
      icon = '6';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 4575 ')) {
      /* Node Zea (Corn) (includes 4577 Zea mays (Maize))*/
      icon = 'c';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 49274 ')) {
      /* Node Lycopersicon (Tomatoes)*/
      icon = ')';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 4512 ')) {
      /* Node Hordeum (Barley)*/
      icon = '5';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 3700 ')) {
      /* Node Brassicaceae (mustard family)*/
      icon = 'B';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 3603 ')) {
      /* Node Vitis (grape)*/
      icon = 'O';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 1462606 ')) {
      /* Node Soja (includes 3847 Glycine max (Soybean))*/
      icon = '^';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 33090 ')) {
      /* Node viridiplantae*/
      icon = '.';
      nodecolor = '#5cb85c';
    } else {
      /* default icon*/
      icon = '.';
    }

    return (
      <Tooltip title="Organism for the node">
        {' '}
        <span
          style={{ color: nodecolor }}
          className={f('small', 'icon', 'icon-species')}
          data-icon={icon}
        />
      </Tooltip>
    );
  }
}

class TaxnameStructures extends PureComponent {
  static propTypes = {
    dataTable: T.array,
    metadata: T.object.isRequired,
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      metadata,
      data: { loading, payload },
    } = this.props;

    return (
      // TODO get values when more than 2 species
      <div
        title={`${loading ? 0 : payload.results[0].metadata.name}( Tax ID: ${
          loading ? 0 : payload.results[0].metadata.accession
        })`}
      >
        {loading ? 0 : payload.results[0].metadata.name}
      </div>
    );
  }
}

class SummaryCounterStructures extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
    metadata: T.object.isRequired,
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      entryDB,
      metadata,
      data: { loading, payload },
    } = this.props;

    let entries = 0;
    let proteins = 0;
    let organisms = 0;
    if (!loading && payload && payload.metadata) {
      entries = payload.metadata.counters.entries;
      proteins = payload.metadata.counters.proteins;
      organisms = payload.metadata.counters.organisms;
    }

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <div className={f('count-entries')}>
          <Tooltip
            title={`${entries} ${entryDB} ${toPlural(
              'entry',
              entries,
            )} matching ${metadata.name}`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'structure' },
                  structure: {
                    db: 'pdb',
                    accession: metadata.accession.toString(),
                  },
                  entry: { isFilter: true, db: entryDB ? entryDB : 'all' },
                },
              }}
            >
              {
                // db icon
              }
              {entryDB ? (
                <MemberSymbol type={entryDB} className={f('md-small')} />
              ) : (
                <MemberSymbol type="all" className={f('md-small')} />
              )}

              <NumberComponent loading={loading} value={entries} />

              <span className={f('label-number')}>
                {toPlural('entry', entries)}
              </span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-proteins')}>
          <Tooltip
            title={`${proteins} ${toPlural('protein', proteins)} matching ${
              metadata.name
            }`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'structure' },
                  structure: {
                    db: 'pdb',
                    accession: metadata.accession.toString(),
                  },
                  protein: { isFilter: true, db: 'UniProt' },
                },
              }}
            >
              <div
                className={f('icon', 'icon-conceptual')}
                data-icon="&#x50;"
              />{' '}
              <NumberComponent loading={loading} value={proteins} />
              <span className={f('label-number')}>
                {toPlural('protein', proteins)}
              </span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-organisms')}>
          <Tooltip
            title={`${organisms} ${toPlural('organism', organisms)} matching ${
              metadata.name
            }`}
          >
            <div className={f('icon', 'icon-count-species')} />{' '}
            <NumberComponent loading={loading} value={organisms} />
            <span className={f('label-number')}>
              {toPlural('organism', organisms)}
            </span>
          </Tooltip>
        </div>
      </div>
    );
  }
}

class SummaryCounterEntries extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
    metadata: T.object.isRequired,
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      entryDB,
      metadata,
      data: { loading, payload },
    } = this.props;

    let proteins = 0;
    let organisms = 0;
    let structures = 0;
    let sets = 0;
    if (!loading && payload && payload.metadata) {
      proteins = payload.metadata.counters.proteins;
      organisms = payload.metadata.counters.organisms;
      structures = payload.metadata.counters.structures;
      sets = payload.metadata.counters.sets;
    }

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <div className={f('count-proteins')}>
          <Tooltip
            title={`${proteins} ${toPlural('protein', proteins)} matching ${
              metadata.name
            }`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: entryDB,
                    accession: metadata.accession.toString(),
                  },
                  protein: { isFilter: true, db: 'UniProt' },
                },
              }}
            >
              <div
                className={f('icon', 'icon-conceptual')}
                data-icon="&#x50;"
              />{' '}
              <NumberComponent loading={loading} value={proteins} />
              <span className={f('label-number')}>
                {toPlural('protein', proteins)}
              </span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-architectures')}>
          <Tooltip title={`... domain architectures matching ${metadata.name}`}>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: entryDB,
                    accession: metadata.accession.toString(),
                    detail: 'domain_architecture',
                  },
                },
              }}
            >
              <div className={f('icon', 'icon-count-ida')} />{' '}
              <NumberComponent loading={loading} value="" />
              <span className={f('label-number')}>domain architectures</span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-organisms')}>
          <Tooltip
            title={`${organisms} ${toPlural('organism', organisms)} matching ${
              metadata.name
            }`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: entryDB,
                    accession: metadata.accession.toString(),
                  },
                  organism: { isFilter: true, db: 'taxonomy' },
                },
              }}
            >
              <div className={f('icon', 'icon-count-species')} />{' '}
              <NumberComponent loading={loading} value={organisms} />
              <span className={f('label-number')}>
                {toPlural('organism', organisms)}
              </span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-structures')}>
          <Tooltip
            title={`${structures}  ${toPlural(
              'structure',
              structures,
            )} matching ${metadata.name}`}
          >
            {// link only when value > 0
            payload && structures > 0 ? (
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: entryDB,
                      accession: metadata.accession.toString(),
                    },
                    structure: { isFilter: true, db: 'PDB' },
                  },
                }}
              >
                <div className={f('icon', 'icon-conceptual')} data-icon="s" />{' '}
                <NumberComponent loading={loading} value={structures} />
                <span className={f('label-number')}>
                  {toPlural('structure', structures)}
                </span>
              </Link>
            ) : (
              <div className={f('no-link')}>
                <div className={f('icon', 'icon-conceptual')} data-icon="s" />{' '}
                <NumberComponent loading={loading} value={structures} />
                <span className={f('label-number')}>
                  {toPlural('structure', structures)}
                </span>
              </div>
            )}
          </Tooltip>
        </div>

        {// show sets counter + icon only when available
        sets > 0 && (
          <div>
            {metadata.source_database.toLowerCase() === 'cdd' ||
            metadata.source_database.toLowerCase() === 'pfam' ? (
              <div className={f('count-sets')}>
                <Tooltip
                  title={`${sets} ${toPlural('set', sets)} matching ${
                    metadata.name
                  }`}
                >
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: entryDB,
                          accession: metadata.accession.toString(),
                        },
                        set: { isFilter: true, db: entryDB },
                      },
                    }}
                  >
                    <div className={f('icon', 'icon-count-set')} />{' '}
                    <NumberComponent loading={loading} value={sets} />
                    <span className={f('label-number')}>
                      {toPlural('set', sets)}
                    </span>
                  </Link>
                </Tooltip>
              </div>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    );
  }
}

class DescriptionEntries extends PureComponent {
  static propTypes = {
    dataTable: T.array,
    metadata: T.object.isRequired,
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      metadata,
      data: { loading, payload },
    } = this.props;
    const GetDesc = `${loading ? 0 : payload.metadata.description[0]}`;
    return (
      <div>
        {payload &&
          payload.metadata &&
          payload.metadata.accession &&
          payload.metadata.description[0] && (
            <div className={f('card-sum')}>
              <div className={f('card-sum-wrapper')}>
                <ParagraphWithCites p={GetDesc} />
              </div>
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: metadata.source_database.toLowerCase(),
                      accession: metadata.accession.toString(),
                    },
                  },
                }}
              >
                [...]
              </Link>
            </div>
          )}
      </div>
    );
  }
}
class SummaryCounterOrg extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
    metadata: T.object.isRequired,
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const {
      entryDB,
      metadata,
      data: { loading, payload },
    } = this.props;
    let entries = 0;
    let proteins = 0;
    let structures = 0;
    let proteomes = 0;
    if (!loading && payload && payload.metadata) {
      entries = payload.metadata.counters.entries;
      proteins = payload.metadata.counters.proteins;
      structures = payload.metadata.counters.structures;
      proteomes = payload.metadata.counters.proteomes;
    }

    return (
      metadata.source_database !== 'proteome' && (
        <div className={f('card-block', 'card-counter', 'label-off')}>
          <div className={f('count-entries')}>
            <Tooltip
              title={`${entries} ${entryDB !== null ? entryDB : ''} ${toPlural(
                'entry',
                entries,
              )} matching ${metadata.name}`}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'organism' },
                    organism: {
                      db: 'taxonomy',
                      accession: metadata.accession.toString(),
                    },
                    entry: { isFilter: true, db: entryDB ? entryDB : 'all' },
                  },
                }}
              >
                {
                  // db icon
                }
                {entryDB ? (
                  <MemberSymbol type={entryDB} className={f('md-small')} />
                ) : (
                  <MemberSymbol type="all" className={f('md-small')} />
                )}

                <NumberComponent loading={loading} value={entries} />
                <span className={f('label-number')}>
                  {toPlural('entry', entries)}
                </span>
              </Link>
            </Tooltip>
          </div>

          <div className={f('count-proteins')}>
            <Tooltip
              title={`${proteins}  ${toPlural('protein', proteins)} matching ${
                metadata.name
              }`}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'organism' },
                    organism: {
                      db: 'taxonomy',
                      accession: metadata.accession.toString(),
                    },
                    protein: { isFilter: true, db: 'UniProt' },
                  },
                }}
              >
                <div
                  className={f('icon', 'icon-conceptual')}
                  data-icon="&#x50;"
                />{' '}
                <NumberComponent loading={loading} value={proteins} />
                <span className={f('label-number')}>
                  {' '}
                  {toPlural('protein', proteins)}
                </span>
              </Link>
            </Tooltip>
          </div>

          <div className={f('count-structures')}>
            <Tooltip
              title={`${structures} ${toPlural(
                'structure',
                structures,
              )} matching ${metadata.name}`}
            >
              {//  link only when value > 0
              payload && payload.metadata.counters.structures > 0 ? (
                <Link
                  to={{
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        db: 'taxonomy',
                        accession: metadata.accession.toString(),
                      },
                      structure: { isFilter: true, db: 'PDB' },
                    },
                  }}
                >
                  <div
                    className={f('icon', 'icon-conceptual')}
                    data-icon="&#x73;"
                  />{' '}
                  <NumberComponent loading={loading} value={structures} />{' '}
                  <span className={f('label-number')}>structures</span>
                </Link>
              ) : (
                <div className={f('no-link')}>
                  <div
                    className={f('icon', 'icon-conceptual')}
                    data-icon="&#x73;"
                  />{' '}
                  <NumberComponent loading={loading} value={structures} />{' '}
                  <span className={f('label-number')}>
                    {toPlural('structure', structures)}
                  </span>
                </div>
              )}
            </Tooltip>
          </div>

          <div className={f('count-proteomes')}>
            <Tooltip title={`${proteomes} proteomes matching ${metadata.name}`}>
              {// link only when value > 0
              payload && proteomes > 0 ? (
                <Link
                  to={{
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        db: metadata.source_database,
                        accession: metadata.accession.toString(),
                        proteomeDB: 'proteome',
                      },
                    },
                  }}
                >
                  <div
                    className={f('icon', 'icon-common', 'icon-bookmark-temp')}
                    data-icon="&#x2e;"
                  />
                  <NumberComponent loading={loading} value={proteomes} />{' '}
                  <span className={f('label-number')}>proteomes</span>
                </Link>
              ) : (
                <div className={f('no-link')}>
                  <div
                    className={f('icon', 'icon-common', 'icon-bookmark-temp')}
                    data-icon="&#x2e;"
                  />
                  <NumberComponent loading={loading} value={proteomes} />{' '}
                  <span className={f('label-number')}>proteomes</span>
                </div>
              )}
            </Tooltip>
          </div>
        </div>
      )
    );
  }
}
class GridView extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
    search: T.string,
  };

  componentWillMount() {
    loadWebComponent(() =>
      import('interpro-components').then(m => m.InterproType),
    ).as('interpro-type');
  }

  render() {
    const { dataTable, entryDB, search } = this.props;
    return (
      <AnimatedEntry className={f('card-wrapper')} element="div">
        {dataTable.map(({ metadata }) => {
          const SummaryCounterOrgWithData = loadData(
            getUrlForOrg(`${metadata.accession}`, entryDB),
          )(SummaryCounterOrg);
          const TaxnameStructuresWithData = loadData(
            getUrlForStructTaxname(`${metadata.accession}`),
          )(TaxnameStructures);
          const SummaryCounterStructuresWithData = loadData(
            getUrlForStruct(`${metadata.accession}`, entryDB),
          )(SummaryCounterStructures);
          const SummaryCounterEntriesWithData = loadData(
            getUrlForEntries(`${metadata.accession}`, entryDB),
          )(SummaryCounterEntries);
          const LineageWithData = loadData(getUrlFor(`${metadata.accession}`))(
            Lineage,
          );
          const DescriptionEntriesWithData = loadData(
            getUrlForEntries(`${metadata.accession}`, entryDB),
          )(DescriptionEntries);
          const SpeciesIconWithData = loadData(
            getUrlFor(`${metadata.accession}`),
          )(SpeciesIcon);

          return (
            <div className={f('card-flex-container')} key={metadata.accession}>
              <div className={f('card-header')}>
                {// TITLE browse organism + proteome
                metadata.source_database === 'taxonomy' ||
                metadata.source_database === 'proteome' ? (
                  <Link
                    to={{
                      description: {
                        main: { key: 'organism' },
                        organism: {
                          db: metadata.source_database.toLowerCase(),
                          accession: metadata.accession.toString(),
                        },
                      },
                    }}
                  >
                    {// Specie ICON  only for taxonomy
                    metadata.source_database.toLowerCase() === 'taxonomy' && (
                      <SpeciesIconWithData />
                    )}

                    <h6>
                      <HighlightedText
                        text={metadata.name}
                        textToHighlight={search}
                      />
                    </h6>
                  </Link>
                ) : null}

                {// TITLE browse entries - INTERPRO ONLY
                metadata.source_database.toLowerCase() === 'interpro' && (
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: metadata.source_database.toLowerCase(),
                          accession: metadata.accession.toString(),
                        },
                      },
                    }}
                  >
                    <Tooltip title={`${metadata.type.replace('_', ' ')} type`}>
                      <interpro-type
                        size="2.5em"
                        type={metadata.type.replace('_', ' ')}
                        aria-label="Entry type"
                      />
                    </Tooltip>
                    <h6>
                      <HighlightedText
                        text={metadata.name}
                        textToHighlight={search}
                      />
                    </h6>
                  </Link>
                )}

                {// TITLE browse entries - all NON interpro MD
                // not protein
                metadata.source_database.toLowerCase() !== 'pdb' &&
                  metadata.source_database.toLowerCase() !== 'taxonomy' &&
                  metadata.source_database !== 'proteome' &&
                  metadata.source_database.toLowerCase() !== 'interpro' && (
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: metadata.source_database.toLowerCase(),
                            accession: metadata.accession.toString(),
                          },
                        },
                      }}
                    >
                      <Tooltip title={`${entryDB} database`}>
                        <MemberSymbol
                          size="2em"
                          type={metadata.source_database.toLowerCase()}
                          aria-label="Database type"
                          className={f('md-small')}
                        />
                      </Tooltip>
                      <h6>
                        <HighlightedText
                          text={metadata.name}
                          textToHighlight={search}
                        />
                      </h6>
                    </Link>
                  )}

                {// TITLE browse strutures
                metadata.source_database.toLowerCase() === 'pdb' && (
                  <Link
                    to={{
                      description: {
                        main: { key: 'structure' },
                        structure: {
                          db: metadata.source_database,
                          accession: metadata.accession,
                        },
                      },
                    }}
                  >
                    <Tooltip
                      title={`3D visualisation for ${metadata.accession.toUpperCase()} structure `}
                    >
                      <img
                        src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${
                          metadata.accession
                        }/traces.jpg`}
                        // src={`//www.ebi.ac.uk/pdbe/static/entry/${metadata.accession}_deposited_chain_front_image-200x200.png`}
                        alt={`structure with accession ${metadata.accession.toUpperCase()}`}
                      />
                    </Tooltip>
                    <h6>
                      <HighlightedText
                        text={metadata.name}
                        textToHighlight={search}
                      />
                    </h6>
                  </Link>
                )}
              </div>

              {// COUNTER  browse organism + proteome
              metadata.source_database === 'proteome' ||
              metadata.source_database === 'taxonomy' ? (
                <SummaryCounterOrgWithData
                  entryDB={entryDB}
                  metadata={metadata}
                />
              ) : null}

              {// COUNTER all db
              metadata.source_database.toLowerCase() !== 'pdb' &&
                metadata.source_database !== 'proteome' &&
                metadata.source_database !== 'taxonomy' && (
                  <SummaryCounterEntriesWithData
                    entryDB={entryDB}
                    metadata={metadata}
                  />
                )}

              {// COUNTER structures
              metadata.source_database.toLowerCase() === 'pdb' && (
                <div>
                  <div className={f('card-subheader')}>
                    {// INFO RESOLUTION BL - browse structures - Xray
                    metadata.experiment_type === 'x-ray' && (
                      <div>
                        {metadata.experiment_type}
                        :{' '}
                        <Tooltip title={`${metadata.resolution} Å resolution`}>
                          {metadata.resolution}Å
                        </Tooltip>
                      </div>
                    )}
                    {// INFO TYPE BL - browse structures -NMR
                    metadata.experiment_type !== 'x-ray' && (
                      <Tooltip title={`Solution ${metadata.experiment_type}`}>
                        {metadata.experiment_type}
                      </Tooltip>
                    )}
                  </div>
                  <div className={f('card-block')}>
                    <SummaryCounterStructuresWithData
                      metadata={metadata}
                      entryDB={entryDB}
                    />
                  </div>
                </div>
              )}

              {// DESCRIPTION all db
              metadata.source_database.toLowerCase() !== 'pdb' &&
                metadata.source_database !== 'proteome' &&
                metadata.source_database !== 'taxonomy' && (
                  <div className={f('card-block')}>
                    <DescriptionEntriesWithData metadata={metadata} />
                  </div>
                )}

              <div className={f('card-footer')}>
                {// INFO LINEAGE BL - browse organism
                metadata.source_database === 'taxonomy' && <LineageWithData />}

                {// INFO RESOLUTION BL - browse structures -NMR
                metadata.source_database.toLowerCase() === 'pdb' && (
                  <div>
                    <TaxnameStructuresWithData metadata={metadata} />
                  </div>
                )}

                {// INFO INTEGRATION BL - browse entries - all NON interpro MD
                metadata.source_database.toLowerCase() !== 'pdb' &&
                  metadata.source_database.toLowerCase() !== 'interpro' &&
                  metadata.source_database !== 'proteome' &&
                  metadata.source_database !== 'taxonomy' && (
                    <div>
                      {metadata.integrated ? 'Integrated: ' : 'Not integrated'}
                      <Link
                        to={{
                          description: {
                            main: { key: 'entry' },
                            entry: {
                              db: 'interpro',
                              accession: metadata.integrated,
                            },
                          },
                        }}
                      >
                        {metadata.integrated}
                      </Link>
                    </div>
                  )}

                {// INFO ID BR - browse organism + proteome
                metadata.source_database === 'proteome' ||
                metadata.source_database === 'taxonomy' ? (
                  <div>
                    {metadata.source_database === 'proteome' && 'Proteome ID: '}
                    {metadata.source_database === 'taxonomy' && 'Tax ID: '}
                    <HighlightedText
                      text={metadata.accession}
                      textToHighlight={search}
                    />
                  </div>
                ) : null}

                {// INFO TYPE BL - InterPro
                metadata.source_database.toLowerCase() === 'interpro' && (
                  <div>{metadata.type.replace('_', ' ')}</div>
                )}

                {// INFO DB BR - all MD
                metadata.source_database !== 'proteome' &&
                  metadata.source_database !== 'taxonomy' && (
                    <div>
                      <HighlightedText
                        text={metadata.accession}
                        textToHighlight={search}
                      />
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </AnimatedEntry>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.entry.db,
  state => state.customLocation.search.search,
  (entryDB, search) => ({ entryDB, search }),
);
export default connect(mapStateToProps)(GridView);
