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
import numberToDisplayText from 'components/NumberLabel/utils/number-to-display-text';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
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
                >
                  {
                    // IE11 fallback for icons
                  }
                  <span
                    className={f('icon-type', {
                      ['icon-family']: entry.type === 'Family',
                      ['icon-domain']: entry.type === 'Domain',
                      ['icon-repeat']: entry.type === 'Repeat',
                      ['icon-hh']: entry.type === 'Homologous Superfamily',
                      ['icon-site']: entry.type === 'Site',
                    })}
                  >
                    {entry.type === 'Family' ? 'F' : null}
                    {entry.type === 'Domain' ? 'D' : null}
                    {entry.type === 'Repeat' ? 'R' : null}
                    {entry.type === 'Homologous Superfamily' ? 'H' : null}
                    {entry.type === 'Site' ? 'S' : null}
                  </span>
                </interpro-type>
              </Tooltip>

              <div>
                <span className={f('card-title')}>{entry.name}</span>
              </div>

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
                  title={`${numberToDisplayText(c.P, true)} ${toPlural(
                    'protein',
                    c.P,
                  )} matching ${entry.name}`}
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
                    disabled={!c.P}
                  >
                    <div
                      className={f('icon', 'icon-conceptual')}
                      data-icon="&#x50;"
                    />{' '}
                    <NumberComponent value={c.P} abbr noTitle />
                    <span className={f('label-number')}>
                      {toPlural('protein', c.P)}
                    </span>
                  </Link>
                </Tooltip>
              </div>
              <div className={f('count-4', 'count-architectures')}>
                <Tooltip
                  title={`${numberToDisplayText(c.I, true)} ${toPlural(
                    'domain architecture',
                    c.I,
                    true,
                  )} matching ${entry.name}`}
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
                    disabled={!c.I}
                  >
                    <div className={f('icon', 'icon-count-ida')} />{' '}
                    <NumberComponent value={c.I} abbr noTitle />
                    <span className={f('label-number')}>
                      domain architectures
                    </span>
                  </Link>
                </Tooltip>
              </div>
              <div className={f('count-4', 'count-organisms')}>
                <Tooltip
                  title={`${numberToDisplayText(c.O, true)} ${toPlural(
                    'taxonomy',
                    c.O,
                    true,
                  )} matching ${entry.name}`}
                >
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: entry.accession,
                        },
                        taxonomy: { isFilter: true, db: 'uniprot' },
                      },
                    }}
                    disabled={!c.O}
                  >
                    <div className={f('icon', 'icon-count-organisms')} />{' '}
                    <NumberComponent value={c.O} abbr noTitle />
                    <span className={f('label-number')}>
                      {toPlural('taxonomy', c.O)}
                    </span>
                  </Link>
                </Tooltip>
              </div>
              <div className={f('count-4', 'count-structures')}>
                <Tooltip
                  title={`${numberToDisplayText(c.S, true)} ${toPlural(
                    'structure',
                    c.S,
                  )} matching ${entry.name}`}
                >
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
                    disabled={!c.S}
                  >
                    <div
                      className={f('icon', 'icon-conceptual')}
                      data-icon="s"
                    />{' '}
                    <NumberComponent value={c.S} abbr noTitle />
                    <span className={f('label-number')}>
                      {toPlural('structure', c.S)}
                    </span>
                  </Link>
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
                //         className={f('icon', 'icon-common')}
                //         data-icon="&#xf1c0;"
                //       />{' '}
                //       <NumberComponent value={entry.Si} abbr />
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
                //       <NumberComponent value={entry.Go} abbr />
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
                //       <NumberComponent value={entry.Pu} abbr />
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
                className={f('icon', 'icon-common')}
                data-icon="&#xf067;"
                aria-label="add to favorite"
              />
            </Tooltip>{' '}
            <Tooltip title="Watch: be notified when this entry is updated">
              <Link
                to={{ description: { other: ['settings'] } }}
                className={f('icon', 'icon-common')}
                data-icon="&#xf06e;"
                aria-label="Watch"
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
                className={f('icon', 'icon-common')}
                data-icon="&#xf044;"
                aria-label="edit"
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
            <AnimatedEntry className={f('card-wrapper')} element="div">
              {latests.map(e => (
                <LatestEntry entry={e} key={e.accession} />
              ))}
            </AnimatedEntry>
            <Link
              to={{
                description: { main: { key: 'entry' } },
              }}
              className={f('button', 'margin-bottom-none')}
            >
              View all latest entries
            </Link>
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
