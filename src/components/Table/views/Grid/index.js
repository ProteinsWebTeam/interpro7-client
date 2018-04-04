import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import MemberSymbol from 'components/Entry/MemberSymbol';
import { NumberComponent } from 'components/NumberLabel';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

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
    if (linetree.includes(' 7227 ') || linetree.includes(' 27457 ')) {
      icon = 'F';
    } else if (linetree.includes(' 7215 ')) {
      /* drosophila melanogaster and Bactrocera dorsalis*/
      icon = 'F';
    } else if (linetree.includes(' 121224 ')) {
      /* Node drosophila*/
      icon = '4';
    } else if (linetree.includes(' 34735 ')) {
      /* Pediculus humanus subsp. corporis (louse)*/
      icon = '$';
    } else if (linetree.includes(' 6855 ')) {
      /* Node Apoidea (bees)*/
      icon = 's';
    } else if (linetree.includes(' 6935 ')) {
      /* Node Scorpiones (Scorpion)*/
      icon = '&';
    } else if (linetree.includes(' 6448 ')) {
      /* Node Ixodida (Ticks)*/
      icon = "'";
    } else if (linetree.includes(' 28376 ')) {
      /* Node Gastropoda (Snail)*/
      icon = '7';
    } else if (linetree.includes(' 9681 ')) {
      /* Node anolis*/
      icon = 'A';
    } else if (linetree.includes(' 9606 ')) {
      /* Node felidae*/
      icon = 'H';
    } else if (linetree.includes(' 3702 ')) {
      /* homo*/
      icon = 'B';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 6239 ')) {
      /* Mouse-ear cress*/
      icon = 'W';
    } else if (linetree.includes(' 9031 ')) {
      /* Caenorhabditis elegans*/
      icon = 'k';
    } else if (linetree.includes(' 9922 ')) {
      /* Chicken*/
      icon = 'm';
    } else if (linetree.includes(' 55153 ')) {
      /* Node Capra (goat)*/
      icon = 'I';
    } else if (linetree.includes(' 9723 ')) {
      /* Node Sciuridae (Squirels)*/
      icon = 'D';
    } else if (linetree.includes(' 8292 ')) {
      /* Node Platanistidae (Dolphin)*/
      icon = 'f';
    } else if (linetree.includes(' 8782 ')) {
      /* Node Amphibia */
      icon = 'n';
    } else if (linetree.includes(' 7157 ')) {
      /* Node Bird (Finch)*/
      icon = '1';
    } else if (linetree.includes(' 6656 ')) {
      /* subNode Culicidae (Mosquito) */
      icon = 'S';
    } else if (linetree.includes(' 1639119 ')) {
      /* Node Arthropoda (Spider)*/
      icon = '@';
    } else if (linetree.includes(' 7955 ')) {
      /* Node Plasmodium (Plasmodiidae)*/
      icon = 'Z';
    } else if (linetree.includes(' 31031 ')) {
      /* Zebrafish */
      icon = 'E';
    } else if (linetree.includes(' 7898 ')) {
      /* Tetraodontidae (Pufferfish) */
      icon = 'Z';
    } else if (linetree.includes(' 10090 ')) {
      /* Node Fish (7898 Actinopterygii NOT 7776 Gnathostomata includes mammals -  NOT 7777 Chondrichthyes)*/
      icon = 'M';
    } else if (linetree.includes(' 10088 ')) {
      /* Mouse*/
      icon = 'M';
    } else if (linetree.includes(' 9368 ')) {
      /* Node Mouse (?)*/
      icon = 'o';
    } else if (linetree.includes(' 10116 ')) {
      /* Node Erinaceidae (Hedgehog)*/
      icon = 'R';
    } else if (linetree.includes(' 9615 ')) {
      /* Rat*/
      icon = 'd';
    } else if (linetree.includes(' 9913 ')) {
      /* Dog*/
      icon = 'C';
    } else if (linetree.includes(' 9783 ')) {
      /* Bovine*/
      icon = 'e';
    } else if (linetree.includes(' 9940 ')) {
      /* Indian Elephant*/
      icon = 'x';
    } else if (linetree.includes(' 9986 ')) {
      /* Sheep */
      icon = 't';
    } else if (linetree.includes(' 9821 ')) {
      /* Rabbit */
      icon = 'p';
    } else if (linetree.includes(' 10141 ')) {
      /*  Suidae (Pig)*/
      icon = 'g';
    } else if (linetree.includes(' 126299 ')) {
      /* Cavia porcellus (Guinea pig)*/
      icon = '9';
    } else if (linetree.includes(' 9555 ')) {
      /*  Monodelphis*/
      icon = '8';
    } else if (linetree.includes(' 9596 ')) {
      /* Papio anubis (Olive baboon)*/
      icon = 'i';
    } else if (linetree.includes(' 9527 ')) {
      /* Node Pan troglodytes (Chimpanzee)*/
      icon = 'r';
    } else if (linetree.includes(' 9430 ')) {
      /* Node Cercopithecidae (Monkeys) to check*/
      icon = '(';
    } else if (linetree.includes(' 9397 ')) {
      /* Vampire bat*/
      icon = '(';
    } else if (linetree.includes(' 9544 ')) {
      /* Node bat Chiroptera*/
      icon = 'r';
    } else if (linetree.includes(' 9599 ')) {
      /* Rhesus macaque*/
      icon = '*';
    } else if (linetree.includes(' 9592 ')) {
      /* Node pongo (orangutan)*/
      icon = 'G';
    } else if (linetree.includes(' 31033 ')) {
      /* Node Gorilla*/
      icon = 'E';
    } else if (linetree.includes(' 4932 ') || linetree.includes('284812')) {
      /* Fugu rubripes*/
      icon = 'Y';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 2157 ')) {
      /* Saccharomyces cerevisiae (Baker's yeast) and Fission yeast*/
      icon = 'Y';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 2 ')) {
      /* Archea*/
      icon = 'L';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 10239 ')) {
      /* Node Bacteria (Ecoli)*/
      icon = 'v';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 4751 ')) {
      /* Node Virus */
      icon = 'u';
      nodecolor = '#5bc0de';
    } else if (linetree.includes(' 4527 ')) {
      /* Node Fungus*/
      icon = '6';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 49274 ')) {
      /* Node Rice (Oriza sativa)*/
      icon = ')';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 4512 ')) {
      /* Node Lycopersicon (Tomatoes)*/
      icon = '5';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 3700 ')) {
      /* Node Barley (Hordeum)*/
      icon = 'B';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 3603 ')) {
      /* Node Brassicaceae ()*/
      icon = 'O';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 1462606 ')) {
      /* Node Vitis (grape)*/
      icon = '^';
      nodecolor = '#5cb85c';
    } else if (linetree.includes(' 33090 ')) {
      /* Node Soja (Glycine max (Soybean))*/
      icon = '.';
      nodecolor = '#5cb85c';
    } else {
      /* Node viridiplantae*/

      icon = '.';
    }

    return (
      <Tooltip title="Related species icon">
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

class SummaryCounter extends PureComponent {
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

              <MemberSymbol type={entryDB} className={f('md-small')} />
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
          </Tooltip>
        </div>

        <div className={f('count-proteomes')}>
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.proteomes
            } proteomes matching ${metadata.name}`}
          >
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
          </Tooltip>
        </div>
      </div>
    );
  }
}
class GridView extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
  };

  render() {
    const { dataTable, entryDB } = this.props;
    return (
      <div className={f('card-wrapper')}>
        {dataTable.map(({ metadata }) => {
          const SummaryCounterWithData = loadData(
            getUrlFor(`${metadata.accession}`),
          )(SummaryCounter);
          const LineageWithData = loadData(getUrlFor(`${metadata.accession}`))(
            Lineage,
          );
          const SpeciesIconWithData = loadData(
            getUrlFor(`${metadata.accession}`),
          )(SpeciesIcon);

          return (
            <div className={f('card-flex-container')} key={metadata.accession}>
              <div className={f('card-item')}>
                <div className={f('card-item-t')}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'organism' },
                        organism: {
                          db: 'taxonomy',
                          accession: metadata.accession.toString(),
                        },
                      },
                    }}
                  >
                    <SpeciesIconWithData />
                    {
                      // TODO make the highlight work with search term
                    }
                    <h6>
                      <HighlightedText
                        text={metadata.name}
                        textToHighlight=""
                      />
                    </h6>
                  </Link>
                </div>

                <SummaryCounterWithData entryDB={entryDB} metadata={metadata} />

                <div className={f('card-item-m')}>
                  Could get a description from wikipedia [...]
                </div>

                <div className={f('card-item-b')}>
                  <LineageWithData />

                  <div>Tax ID: {metadata.accession}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.entry.db,
  entryDB => ({ entryDB }),
);
export default connect(mapStateToProps)(GridView);
