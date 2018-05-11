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
      counter: T.number,
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

          <div
            className={f('card-block', 'card-counter', 'label-off', 'label-h')}
          >
            {' '}
            <div className={f('count-proteins')}>
              <Tooltip
                title={`${entry.counter_P} ${toPlural(
                  'protein',
                  entry.counter_P,
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
                >
                  <div
                    className={f('icon', 'icon-conceptual')}
                    data-icon="&#x50;"
                  />{' '}
                  <NumberComponent value={entry.counter_P} />
                  <span className={f('label-number')}>
                    {toPlural('protein', entry.counter_P)}
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div className={f('count-architectures')}>
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
                  <NumberComponent value={entry.counter_I} />
                  <span className={f('label-number')}>
                    domain architectures
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div className={f('count-organisms')}>
              <Tooltip
                title={`${entry.counter_O} ${toPlural(
                  'organism',
                  entry.counter_O,
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
                      organism: { isFilter: true, db: 'taxonomy' },
                    },
                  }}
                >
                  <div className={f('icon', 'icon-count-organisms')} />{' '}
                  <NumberComponent value={entry.counter_O} />
                  <span className={f('label-number')}>
                    {toPlural('organism', entry.counter_O)}
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div className={f('count-structures')}>
              <Tooltip
                title={`${entry.counter_S}  ${toPlural(
                  'structure',
                  entry.counter_S,
                )} matching ${entry.name}`}
              >
                {// link only when value > 0
                entry.counter_S > 0 ? (
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
                    <NumberComponent value={entry.counter_S} />
                    <span className={f('label-number')}>
                      {toPlural('structure', entry.counter_S)}
                    </span>
                  </Link>
                ) : (
                  <div className={f('no-link')}>
                    <div
                      className={f('icon', 'icon-conceptual')}
                      data-icon="s"
                    />{' '}
                    <NumberComponent value={entry.counter_S} />
                    <span className={f('label-number')}>
                      {toPlural('structure', entry.counter_S)}
                    </span>
                  </div>
                )}
              </Tooltip>
            </div>
          </div>
          <div className={f('card-footer')}>
            <div>{entry.type}</div>
            <div>{entry.accession}</div>
          </div>

          <div className={f('card-options')}>
            <Tooltip title={`Add this entry to your favorites`}>
              <Link
                to={{ description: { other: ['settings'] } }}
                className={f('icon', 'icon-functional')}
                data-icon="+"
                aria-label="settings"
              />
            </Tooltip>{' '}
            <Tooltip title={`Follow, be notified when this entry is updated`}>
              <Link
                to={{ description: { other: ['settings'] } }}
                className={f('icon', 'icon-functional')}
                data-icon="4"
                aria-label="settings"
              />
            </Tooltip>{' '}
            <Tooltip title={`Edit this entry`}>
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

          {
            // SIGNATURE INFO
            // entry.contributing.map(c => (
            //   <div className={f('list-more')} key={c.accession}>
            //     <MemberSymbol
            //       type={c.source_database}
            //       className={f('md-small')}
            //     />
            //     <small>
            //       {c.source_database}:
            //       <Link
            //         to={{
            //           description: {
            //             main: { key: 'entry' },
            //             entry: {
            //               db: c.source_database,
            //               accession: c.accession,
            //             },
            //           },
            //         }}
            //         className={f('list-sign')}
            //       >
            //         {' '}
            //         {c.accession}
            //       </Link>
            //     </small>
            //   </div>
            // ))
          }
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
              {latests.map(e => <LatestEntry entry={e} key={e.accession} />)}
            </AnimatedEntry>
            <Link
              to={{
                description: { main: { key: 'entry' } },
              }}
              className={f('button')}
            >
              View all entries
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
