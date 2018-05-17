import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { toPlural } from 'utils/pages';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { latests } from 'staticData/home';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/load-web-component';
import { NumberComponent } from 'components/NumberLabel';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

class LatestEntry extends PureComponent {
  static propTypes = {
    entry: T.shape({
      accession: T.string,
      type: T.string,
      name: T.string,
      counter: T.array,
      contributing: T.array,
    }),
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const { entry } = this.props;
    return (
      <div className={f('card-flex-container', 'card-shrink')}>
        <div className={f('list-body')}>
          <div className={f('card-header')}>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: 'InterPro',
                    accession: entry.accession,
                  },
                },
              }}
            >
              <Tooltip title={`${entry.type} type`}>
                <interpro-type
                  dimension="1.5em"
                  type={entry.type}
                  aria-label="Entry type"
                />
              </Tooltip>
              <Tooltip title={`${entry.name} (${entry.accession})`}>
                <h6>{entry.name}</h6>
              </Tooltip>
              <span className={f('name-ac')}>{entry.accession}</span>
            </Link>
          </div>

          {entry.counter.map(c => (
            <div
              key={c}
              className={f(
                'card-block',
                'card-counter',
                'label-off',
                'label-h',
              )}
            >
              {' '}
              <div className={f('count-4', 'count-proteins')}>
                <Tooltip
                  title={`${c.P} ${toPlural('protein', c.P)} matching ${
                    entry.name
                  }`}
                >
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: entry.accession,
                        },
                        protein: { isFilter: true, db: 'UniProt' },
                      },
                    }}
                  >
                    <div
                      className={f('icon', 'icon-conceptual')}
                      data-icon="&#x50;"
                    />{' '}
                    <NumberComponent value={c.P} />
                    <span className={f('label-number')}>
                      {toPlural('protein', c.P)}
                    </span>
                  </Link>
                </Tooltip>
              </div>
              <div className={f('count-4', 'count-architectures')}>
                <Tooltip
                  title={`... domain architectures matching ${entry.name}`}
                >
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: entry.accession,
                          detail: 'domain_architecture',
                        },
                      },
                    }}
                  >
                    <div className={f('icon', 'icon-count-ida')} />{' '}
                    <NumberComponent value={c.I} />
                    <span className={f('label-number')}>
                      domain architectures
                    </span>
                  </Link>
                </Tooltip>
              </div>
              <div className={f('count-4', 'count-organisms')}>
                <Tooltip
                  title={`${c.O} ${toPlural('organism', c.O)} matching ${
                    entry.name
                  }`}
                >
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: entry.accession,
                        },
                        organism: { isFilter: true, db: 'taxonomy' },
                      },
                    }}
                  >
                    <div className={f('icon', 'icon-count-organisms')} />{' '}
                    <NumberComponent value={c.O} />
                    <span className={f('label-number')}>
                      {toPlural('organism', c.O)}
                    </span>
                  </Link>
                </Tooltip>
              </div>
              <div className={f('count-4', 'count-structures')}>
                <Tooltip
                  title={`${c.S}  ${toPlural('structure', c.S)} matching ${
                    entry.name
                  }`}
                >
                  {// link only when value > 0
                  c.S > 0 ? (
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: 'InterPro',
                            accession: entry.accession,
                          },
                          structure: { isFilter: true, db: 'PDB' },
                        },
                      }}
                    >
                      <div
                        className={f('icon', 'icon-conceptual')}
                        data-icon="s"
                      />{' '}
                      <NumberComponent value={c.S} />
                      <span className={f('label-number')}>
                        {toPlural('structure', c.S)}
                      </span>
                    </Link>
                  ) : (
                    <div className={f('no-link')}>
                      <div
                        className={f('icon', 'icon-conceptual')}
                        data-icon="s"
                      />{' '}
                      <NumberComponent value={c.S} />
                      <span className={f('label-number')}>
                        {toPlural('structure', c.S)}
                      </span>
                    </div>
                  )}
                </Tooltip>
              </div>
              {// OPTION COUNT SIGNATURES - ICON SVG
              entry.contributing.map(c => (
                <div className={f('icon-count-signatures')} key={c.accession}>
                  <Tooltip
                    title={`${c.source_database} signature:  ${c.accession}`}
                  >
                    {' '}
                    <MemberSymbol
                      type={c.source_database}
                      className={f('md-small')}
                    />
                  </Tooltip>
                </div>
              ))}
              {
                // OPTION COUNT SIGNATURES
                // <div className={f('count-signatures')}>
                //   <Tooltip
                //     title={`${entry.Si} contributing signatures matching ${entry.name}`}
                //   >
                //
                //     <Link
                //       to={{
                //         description: {
                //           main: { key: 'entry' },
                //           entry: {
                //             db: 'InterPro',
                //             accession: entry.accession,
                //           },
                //         },
                //       }}
                //     >
                //       <div
                //         className={f('icon', 'icon-generic')}
                //         data-icon="D"
                //       />{' '}
                //       <NumberComponent value={entry.Si} />
                //       <span className={f('label-number')}>
                //         signatures
                //       </span>
                //     </Link>
                //
                //   </Tooltip>
                // </div>
              }
              {
                // OPTION COUNT GO-TERMS
                //   <div className={f('count-go')}>
                //   <Tooltip
                //     title={`${entry.Go} GO terms matching ${entry.name}`}
                //   >
                //
                //     <Link
                //       to={{
                //           description: {
                //             main: { key: 'entry' },
                //             entry: {
                //               db: 'InterPro',
                //               accession: entry.accession,
                //             },
                //           },
                //         }}
                //     >
                //       <div
                //         className={f('icon', 'icon-count-go')}
                //       />{' '}
                //       <NumberComponent value={entry.Go} />
                //         <span className={f('label-number')}>
                //           GO terms
                //         </span>
                //     </Link>
                //
                //   </Tooltip>
                // </div>
              }
              {
                // OPTION COUNT PUBLICATIONS
                // <div className={f('count-publications')}>
                //   <Tooltip
                //     title={`${entry.Pu} publications matching ${entry.name}`}
                //   >
                //
                //     <Link
                //       to={{
                //         description: {
                //           main: { key: 'entry' },
                //           entry: {
                //             db: 'InterPro',
                //             accession: entry.accession,
                //           },
                //         },
                //       }}
                //     >
                //       <div
                //         className={f('icon', 'icon-generic')}
                //         data-icon="P"
                //       />{' '}
                //       <NumberComponent value={entry.Pu} />
                //       <span className={f('label-number')}>
                //         publications
                //       </span>
                //     </Link>
                //
                //   </Tooltip>
                // </div>
              }
            </div>
          ))}
          <div className={f('card-footer')}>
            <div>{entry.type}</div>
            <div>{entry.accession}</div>
          </div>

          <div className={f('card-options')}>
            <Tooltip title="Add this entry to your favorites">
              <Link
                to={{ description: { other: ['settings'] } }}
                className={f('icon', 'icon-functional')}
                data-icon="+"
                aria-label="settings"
              />
            </Tooltip>{' '}
            <Tooltip title="Watch: be notified when this entry is updated">
              <Link
                to={{ description: { other: ['settings'] } }}
                className={f('icon', 'icon-functional')}
                data-icon="4"
                aria-label="settings"
              />
            </Tooltip>{' '}
            <Tooltip title="Suggest an edit">
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: 'InterPro',
                      accession: entry.accession,
                    },
                  },
                }}
                className={f('icon', 'icon-functional')}
                data-icon="5"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

class ByEntriesFeatured extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    return (
      <div className={f('feat-entry-list')}>
        <div className={f('row')}>
          <div className={f('columns')}>
            <p>
              This list highlights all entries that have been used on the
              lastest protein focus article:
            </p>

            <div className={f('card-flex-container', 'card-shrink')}>
              <div className={f('list-body')}>
                <div className={f('card-header')}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: 'IPR035648',
                        },
                      },
                    }}
                  >
                    <Tooltip title="domain type">
                      <interpro-type
                        dimension="1.5em"
                        type="domain"
                        aria-label="Entry type"
                      />
                    </Tooltip>
                    <Tooltip title="srGAP1/2/3, SH3 domain (IPR035648)">
                      <h6>srGAP1/2/3, SH3 domain</h6>
                    </Tooltip>
                    <span className={f('name-ac')}>IPR035648</span>
                  </Link>
                </div>

                <div className={f('card-footer')}>
                  <div>domain</div>
                  <div>IPR035648</div>
                </div>

                <div className={f('card-options')}>
                  <Tooltip title="Add this entry to your favorites">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="+"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Watch: be notified when this entry is updated">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="4"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Suggest an edit">
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: 'InterPro',
                            accession: 'IPR035648',
                          },
                        },
                      }}
                      className={f('icon', 'icon-functional')}
                      data-icon="5"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className={f('card-flex-container', 'card-shrink')}>
              <div className={f('list-body')}>
                <div className={f('card-header')}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: 'IPR030252',
                        },
                      },
                    }}
                  >
                    <Tooltip title="family type">
                      <interpro-type
                        dimension="1.5em"
                        type="family"
                        aria-label="Family type"
                      />
                    </Tooltip>
                    <Tooltip title="SLIT-ROBO Rho GTPase-activating protein 2 (IPR030252)">
                      <h6>SLIT-ROBO Rho GTPase-activating protein 2</h6>
                    </Tooltip>
                    <span className={f('name-ac')}>IPR030252</span>
                  </Link>
                </div>

                <div className={f('card-footer')}>
                  <div>family</div>
                  <div>IPR030252</div>
                </div>

                <div className={f('card-options')}>
                  <Tooltip title="Add this entry to your favorites">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="+"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Watch: be notified when this entry is updated">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="4"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Suggest an edit">
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: 'InterPro',
                            accession: 'IPR030252',
                          },
                        },
                      }}
                      className={f('icon', 'icon-functional')}
                      data-icon="5"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    }),
);

export default loadData(mapStateToUrl)(ByEntriesFeatured);
