import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import MemberSymbol from 'components/Entry/MemberSymbol';
import { NumberComponent } from 'components/NumberLabel';
import { ParagraphWithCites } from 'components/Description';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

const getUrlForOrg = accession =>
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

class Lineage extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };
  render() {
    const { data: { loading, payload } } = this.props;
    const linetree = `${loading ? 0 : payload.metadata.lineage}`;
    let superkingdom = null;
    let nodespot = null;

    if (linetree.includes(' 2759 ')) {
      superkingdom = 'Eukaryota';
    } else if (linetree.includes(' 2157 ')) {
      superkingdom = 'Archaea';
    } else if (linetree.includes(' 10239 ')) {
      superkingdom = 'Viruses';
    } else if (linetree.includes(' 12884 ')) {
      superkingdom = 'Viroids';
    } else if (linetree.includes(' 2 ')) {
      superkingdom = 'Bacteria';
    } else {
      superkingdom = 'N/A';
    }

    if (linetree.includes(' 1224 ')) {
      nodespot = 'Proteobacteria';
    } else if (linetree.includes(' 201174 ')) {
      nodespot = 'Actinobacteria';
    } else if (linetree.includes(' 203691 ')) {
      nodespot = 'Spirochaetes';
    } else if (linetree.includes(' 203682 ')) {
      nodespot = 'Planctomycetes';
    } else if (linetree.includes(' 1239 ')) {
      nodespot = 'Firmicutes';
    } else if (linetree.includes(' 976 ')) {
      nodespot = 'Bacteroidetes';
    } else if (linetree.includes(' 40674 ')) {
      nodespot = 'Mammalia';
    } else if (linetree.includes(' 6656 ')) {
      nodespot = 'Arthropoda';
    } else if (linetree.includes(' 33090 ')) {
      nodespot = 'Viridiplantae';
    } else if (linetree.includes(' 6231 ')) {
      nodespot = 'Nematoda';
    } else if (linetree.includes(' 8782 ')) {
      nodespot = 'Birds';
    } else if (linetree.includes(' 4751 ')) {
      nodespot = 'Fungi';
    } else if (linetree.includes(' 32561 ')) {
      nodespot = 'Sauria';
    } else if (linetree.includes('7898 ')) {
      nodespot = 'Fish';
    } else {
      /* Actinopterygii - 89593 craniata too general*/
      nodespot = 'N/A';
    }

    return (
      <Tooltip title={`Lineage: ${loading ? 0 : payload.metadata.lineage} `}>
        {superkingdom} ({nodespot})
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
    const { data: { loading, payload } } = this.props;
    const linetree = `${loading ? 0 : payload.metadata.lineage}`;
    let icon = null;
    let nodecolor = null;

    // key species in Interpro & EBI
    /* drosophila melanogaster and Bactrocera dorsalis*/
    if (linetree.includes(' 7227 ') || linetree.includes(' 27457 ')) {
      icon = 'F';
    } else if (linetree.includes(' 7215 ')) {
      /* Node drosophila*/
      icon = 'F';
    } else if (linetree.includes(' 121224 ')) {
      /* Pediculus humanus subsp. corporis (louse)*/
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
      /* Node felidae*/
      icon = 'A';
    } else if (linetree.includes(' 9606 ')) {
      /* homo*/
      icon = 'H';
    } else if (linetree.includes(' 3702 ')) {
      /* Mouse-ear cress*/
      icon = 'B';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 6239 ')) {
      /* Caenorhabditis elegans*/
      icon = 'W';
    } else if (linetree.includes(' 9031 ')) {
      /* Chicken*/
      icon = 'k';
    } else if (linetree.includes(' 9922 ')) {
      /* Node Capra (goat)*/
      icon = 'm';
    } else if (linetree.includes(' 55153 ')) {
      /* Node Sciuridae (Squirels)*/
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
      /* Tetraodontidae (Pufferfish) */
      icon = 'E';
    } else if (linetree.includes(' 7898 ')) {
      /* Node Fish (7898 Actinopterygii NOT 7776 Gnathostomata includes mammals -  NOT 7777 Chondrichthyes)*/
      icon = 'Z';
    } else if (linetree.includes(' 10090 ')) {
      /* Mouse*/
      icon = 'M';
    } else if (linetree.includes(' 10088 ')) {
      /* Node Mouse (?)*/
      icon = 'M';
    } else if (linetree.includes(' 9368 ')) {
      /* Node Erinaceidae (Hedgehog)*/
      icon = 'o';
    } else if (linetree.includes(' 10116 ')) {
      /* Rat*/
      icon = 'R';
    } else if (linetree.includes(' 9615 ')) {
      /* Dog*/
      icon = 'd';
    } else if (linetree.includes(' 9913 ')) {
      /* Bovine*/
      icon = 'C';
    } else if (linetree.includes(' 9783 ')) {
      /* Indian Elephant*/
      icon = 'e';
    } else if (linetree.includes(' 9940 ')) {
      /* Sheep */
      icon = 'x';
    } else if (linetree.includes(' 9986 ')) {
      /* Rabbit */
      icon = 't';
    } else if (linetree.includes(' 9821 ')) {
      /*  Suidae (Pig)*/
      icon = 'p';
    } else if (linetree.includes(' 10141 ')) {
      /* Cavia porcellus (Guinea pig)*/
      icon = 'g';
    } else if (linetree.includes(' 126299 ')) {
      /*  Monodelphis*/
      icon = '9';
    } else if (linetree.includes(' 9555 ')) {
      /* Papio anubis (Olive baboon)*/
      icon = '8';
    } else if (linetree.includes(' 9596 ')) {
      /* Node Pan troglodytes (Chimpanzee)*/
      icon = 'i';
    } else if (linetree.includes(' 9527 ')) {
      /* Node Cercopithecidae (Monkeys) to check*/
      icon = 'r';
    } else if (linetree.includes(' 9430 ')) {
      /* Vampire bat*/
      icon = '(';
    } else if (linetree.includes(' 9397 ')) {
      /* Node bat Chiroptera*/
      icon = '(';
    } else if (linetree.includes(' 9544 ')) {
      /* Rhesus macaque*/
      icon = 'r';
    } else if (linetree.includes(' 9599 ')) {
      /* Node pongo (orangutan)*/
      icon = '*';
    } else if (linetree.includes(' 9592 ')) {
      /* Node Gorilla*/
      icon = 'G';
    } else if (linetree.includes(' 31033 ')) {
      /* Fugu rubripes*/
      icon = 'E';
    } else if (linetree.includes(' 4932 ') || linetree.includes('4894')) {
      /* Node Fission yeasts (Schizosaccharomycetaceae)*/
      icon = 'Y';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 2157 ')) {
      /* Archea*/
      icon = 'Y';
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
      /* Node Rice (Oriza sativa)*/
      icon = '6';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 49274 ')) {
      /* Node Lycopersicon (Tomatoes)*/
      icon = ')';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 4512 ')) {
      /* Node Barley (Hordeum)*/
      icon = '5';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 3700 ')) {
      /* Node Brassicaceae ()*/
      icon = 'B';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 3603 ')) {
      /* Node Vitis (grape)*/
      icon = 'O';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 1462606 ')) {
      /* Node Soja (Glycine max (Soybean))*/
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
      <Tooltip title="Specy icon for the node">
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
    const { entryDB, metadata, data: { loading, payload } } = this.props;
    return (
      <div className={f('card-item-m', 'card-sum-info', 'label-off')}>
        <div className={f('count-proteins')}>
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.proteins
            } proteins matching ${metadata.name}`}
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
              <NumberComponent
                loading={loading}
                value={loading ? 0 : payload.metadata.counters.proteins}
              />
              <span className={f('label-number')}>protein</span>
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
            title={`${
              loading ? 0 : payload.metadata.counters.organisms
            } species matching ${metadata.name}`}
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
              <NumberComponent
                loading={loading}
                value={loading ? 0 : payload.metadata.counters.organisms}
              />
              <span className={f('label-number')}>species</span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-structures')}>
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.structures
            }  structures matching ${metadata.name}`}
          >
            {// link only when value > 0
            payload && payload.metadata.counters.structures > 0 ? (
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
                <NumberComponent
                  loading={loading}
                  value={loading ? 0 : payload.metadata.counters.structures}
                />
                <span className={f('label-number')}>structures</span>
              </Link>
            ) : (
              <div className={f('no-link')}>
                <div className={f('icon', 'icon-conceptual')} data-icon="s" />{' '}
                <NumberComponent
                  loading={loading}
                  value={loading ? 0 : payload.metadata.counters.structures}
                />
                <span className={f('label-number')}>structures</span>
              </div>
            )}
          </Tooltip>
        </div>

        {// show sets counter + icon only when available
        payload &&
          payload.metadata &&
          payload.metadata.accession &&
          payload.metadata.counters.sets > 0 && (
            <div>
              {metadata.source_database.toLowerCase() === 'cdd' ||
              metadata.source_database.toLowerCase() === 'pfam' ? (
                <div className={f('count-sets')}>
                  <Tooltip title={`... sets matching ${metadata.name}`}>
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
                      <NumberComponent
                        loading={loading}
                        value={loading ? 0 : payload.metadata.counters.sets}
                      />
                      <span className={f('label-number')}>sets</span>
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
    const { entryDB, metadata, data: { loading, payload } } = this.props;
    return (
      <div>
        {payload &&
          payload.metadata &&
          payload.metadata.accession &&
          payload.metadata.description[0] && (
            <div className={f('card-sum')}>
              <div className={f('card-sum-wrapper')}>
                {loading ? 0 : payload.metadata.description[0]}
              </div>
              {
                //<ParagraphWithCites p={loading ? 0 : payload.metadata.description[0]} />
              }
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
    const { entryDB, metadata, data: { loading, payload } } = this.props;
    return (
      metadata.source_database !== 'proteome' && (
        <div className={f('card-item-m', 'card-sum-info', 'label-off')}>
          <div className={f('count-entries')}>
            {
              // counts should change for each db selected but is NOT
            }
            <Tooltip
              title={`${
                loading ? 0 : payload.metadata.counters.entries
              } ${entryDB} entries matching ${metadata.name}`}
            >
              {
                // keep db: 'all' while counter are not working (otherwise use db: entryDB)
              }
              <Link
                to={{
                  description: {
                    main: { key: 'organism' },
                    organism: {
                      db: 'taxonomy',
                      accession: metadata.accession.toString(),
                    },
                    entry: { isFilter: true, db: 'all' },
                  },
                }}
              >
                {
                  // db icon
                }
                {entryDB !== null && (
                  <MemberSymbol type={entryDB} className={f('md-small')} />
                )}
                {entryDB === null && (
                  <MemberSymbol type="all" className={f('md-small')} />
                )}
                <NumberComponent
                  loading={loading}
                  value={loading ? 0 : payload.metadata.counters.entries}
                />
                <span className={f('label-number')}>entries</span>
              </Link>
            </Tooltip>
          </div>

          <div className={f('count-proteins')}>
            <Tooltip
              title={`${
                loading ? 0 : payload.metadata.counters.proteins
              } proteins matching ${metadata.name}`}
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
                <NumberComponent
                  loading={loading}
                  value={loading ? 0 : payload.metadata.counters.proteins}
                />
                <span className={f('label-number')}>proteins</span>
              </Link>
            </Tooltip>
          </div>

          <div className={f('count-structures')}>
            <Tooltip
              title={`${
                loading ? 0 : payload.metadata.counters.structures
              } structures matching ${metadata.name}`}
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
                  <NumberComponent
                    loading={loading}
                    value={loading ? 0 : payload.metadata.counters.structures}
                  />{' '}
                  <span className={f('label-number')}>structures</span>
                </Link>
              ) : (
                <div className={f('no-link')}>
                  <div
                    className={f('icon', 'icon-conceptual')}
                    data-icon="&#x73;"
                  />{' '}
                  <NumberComponent
                    loading={loading}
                    value={loading ? 0 : payload.metadata.counters.structures}
                  />{' '}
                  <span className={f('label-number')}>structures</span>
                </div>
              )}
            </Tooltip>
          </div>

          {metadata.source_database !== 'proteome' && (
            <div className={f('count-proteomes')}>
              <Tooltip
                title={`${
                  loading ? 0 : payload.metadata.counters.proteomes
                } proteomes matching ${metadata.name}`}
              >
                {// link only when value > 0
                payload && payload.metadata.counters.proteomes > 0 ? (
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
                    <NumberComponent
                      loading={loading}
                      value={loading ? 0 : payload.metadata.counters.proteomes}
                    />{' '}
                    <span className={f('label-number')}>proteomes</span>
                  </Link>
                ) : (
                  <div className={f('no-link')}>
                    <div
                      className={f('icon', 'icon-common', 'icon-bookmark-temp')}
                      data-icon="&#x2e;"
                    />
                    <NumberComponent
                      loading={loading}
                      value={loading ? 0 : payload.metadata.counters.proteomes}
                    />{' '}
                    <span className={f('label-number')}>proteomes</span>
                  </div>
                )}
              </Tooltip>
            </div>
          )}
        </div>
      ) //no counter found for proteomes for now
    );
  }
}
class GridView extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
    search: T.string,
  };

  render() {
    const { dataTable, entryDB, search } = this.props;
    return (
      <AnimatedEntry className={f('card-wrapper')} element="div">
        {dataTable.map(({ metadata }) => {
          const SummaryCounterOrgWithData = loadData(
            getUrlForOrg(`${metadata.accession}`),
          )(SummaryCounterOrg);
          const SummaryCounterEntriesWithData = loadData(
            getUrlForEntries(`${metadata.accession}`, entryDB),
          )(SummaryCounterEntries);
          const LineageWithData = loadData(
            getUrlForOrg(`${metadata.accession}`),
          )(Lineage);
          const DescriptionEntriesWithData = loadData(
            getUrlForEntries(`${metadata.accession}`, entryDB),
          )(DescriptionEntries);
          const SpeciesIconWithData = loadData(
            getUrlForOrg(`${metadata.accession}`),
          )(SpeciesIcon);

          return (
            <div className={f('card-flex-container')} key={metadata.accession}>
              <div className={f('card-item')}>
                <div className={f('card-item-t')}>
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
                      {//Specie ICON  only for taxonomy
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
                      <Tooltip
                        title={`${metadata.type.replace('_', ' ')} type`}
                      >
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
                metadata.source_database !== 'proteome' &&
                  metadata.source_database !== 'taxonomy' && (
                    <SummaryCounterEntriesWithData
                      entryDB={entryDB}
                      metadata={metadata}
                    />
                  )}

                {// DESCRIPTION all db
                metadata.source_database !== 'proteome' &&
                  metadata.source_database !== 'taxonomy' && (
                    <div className={f('card-item-m')}>
                      <DescriptionEntriesWithData metadata={metadata} />
                    </div>
                  )}

                <div className={f('card-item-b')}>
                  {// INFO LINEAGE BL - browse organism
                  metadata.source_database === 'taxonomy' && (
                    <LineageWithData />
                  )}

                  {// INFO TYPE BL - browse entries - Interpro ONLY
                  metadata.source_database.toLowerCase() === 'interpro' && (
                    <div>{metadata.type.replace('_', ' ')}</div>
                  )}

                  {// INFO ID BR - browse organism + proteome
                  metadata.source_database === 'proteome' ||
                  metadata.source_database === 'taxonomy' ? (
                    <div>
                      {metadata.source_database === 'proteome' &&
                        'Proteome ID: '}
                      {metadata.source_database === 'taxonomy' && 'Tax ID:'}
                      {metadata.accession}
                    </div>
                  ) : null}

                  {// INFO INTEGRATION BL - browse entries - all NON interpro MD
                  metadata.source_database.toLowerCase() !== 'interpro' &&
                    metadata.source_database !== 'proteome' &&
                    metadata.source_database !== 'taxonomy' && (
                      <div>
                        {metadata.integrated
                          ? 'Integrated: '
                          : 'Not integrated'}
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

                  {// INFO DB BR - all MD
                  metadata.source_database !== 'proteome' &&
                    metadata.source_database !== 'taxonomy' && (
                      <div>{metadata.accession}</div>
                    )}
                </div>
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
