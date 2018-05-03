import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { toPlural } from 'utils/pages';
import getColor from 'utils/taxonomy/get-color';
import getIcon from 'utils/taxonomy/get-icon';
import getNodeSpotlight from 'utils/taxonomy/get-node-spotlight';
import getSuperKingdom from 'utils/taxonomy/get-super-kingdom';

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
    const nodespot = getNodeSpotlight(lineage);

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
    let icon = '.';
    let color;
    if (!loading && payload) {
      icon = getIcon(payload.metadata.lineage) || '.';
      color = getColor(payload.metadata.lineage);
    }

    // key species in Interpro & EBI

    return (
      <span
        style={{ color }}
        className={f('small', 'icon', 'icon-species')}
        data-icon={icon}
      />
    );
  }
}

class TaxnameStructures extends PureComponent {
  static propTypes = {
    dataTable: T.array,
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
                  entry: { isFilter: true, db: entryDB || 'all' },
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

              <NumberComponent
                loading={loading}
                value={entries}
                abbr
                scaleMargin={1}
              />

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
              <NumberComponent
                loading={loading}
                value={proteins}
                abbr
                scaleMargin={1}
              />
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
            <NumberComponent
              loading={loading}
              value={organisms}
              abbr
              scaleMargin={1}
            />
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
              <NumberComponent
                loading={loading}
                value={proteins}
                abbr
                scaleMargin={1}
              />
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
              <NumberComponent
                loading={loading}
                value=""
                abbr
                scaleMargin={1}
              />
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
              <NumberComponent
                loading={loading}
                value={organisms}
                abbr
                scaleMargin={1}
              />
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
                <NumberComponent
                  loading={loading}
                  value={structures}
                  abbr
                  scaleMargin={1}
                />
                <span className={f('label-number')}>
                  {toPlural('structure', structures)}
                </span>
              </Link>
            ) : (
              <div className={f('no-link')}>
                <div className={f('icon', 'icon-conceptual')} data-icon="s" />{' '}
                <NumberComponent
                  loading={loading}
                  value={structures}
                  abbr
                  scaleMargin={1}
                />
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
                    <NumberComponent
                      loading={loading}
                      value={sets}
                      abbr
                      scaleMargin={1}
                    />
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
              title={`${entries} ${entryDB || ''} ${toPlural(
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
                    entry: { isFilter: true, db: entryDB && 'all' },
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

                <NumberComponent
                  loading={loading}
                  value={entries}
                  abbr
                  scaleMargin={1}
                />
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
                <NumberComponent
                  loading={loading}
                  value={proteins}
                  abbr
                  scaleMargin={1}
                />
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
                  <NumberComponent
                    loading={loading}
                    value={structures}
                    abbr
                    scaleMargin={1}
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
                    value={structures}
                    abbr
                    scaleMargin={1}
                  />{' '}
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
                  <NumberComponent
                    loading={loading}
                    value={proteomes}
                    abbr
                    scaleMargin={1}
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
                    value={proteomes}
                    abbr
                    scaleMargin={1}
                  />{' '}
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
