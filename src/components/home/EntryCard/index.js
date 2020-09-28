import React, { PureComponent } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { toPlural } from 'utils/pages';

import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';

import loadWebComponent from 'utils/load-web-component';
import NumberComponent from 'components/NumberComponent';
import numberToDisplayText from 'components/NumberComponent/utils/number-to-display-text';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

/*:: type Props = {
  entry: {
    metadata: {
      accession: string,
      type: string,
      name: string,
      source_databases: string,
      member_databases: Object,
    },
  extra_fields: {
    counters: {
       domain_architectures: number,
       proteins: number,
       proteomes: number,
       sets: number,
       structures: number,
       taxa: number,
      },
    },
  }
}*/

export class EntryCard extends PureComponent /*:: <Props> */ {
  static propTypes = {
    entry: T.shape({
      metadata: T.shape({
        accession: T.string,
        type: T.string,
        name: T.string,
        source_database: T.string,
        member_databases: T.object,
      }),
      extra_fields: T.shape({
        counters: T.shape({
          domain_architectures: T.number,
          proteins: T.number,
          proteomes: T.number,
          sets: T.number,
          structures: T.number,
          taxa: T.number,
        }),
      }),
    }),
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }

  render() {
    const { entry } = this.props;
    return (
      <div
        className={f('grid-card', 'card-shrink')}
        data-testid="by-latest-entries-box"
      >
        <div className={f('list-body')}>
          <div className={f('card-header')}>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: 'InterPro',
                    accession: entry.metadata.accession,
                  },
                },
              }}
            >
              <Tooltip title={`${entry.metadata.type} type`}>
                <interpro-type
                  dimension="1.5em"
                  type={entry.metadata.type.replace('_', ' ')}
                  aria-label="Entry type"
                >
                  {
                    // IE11 fallback for icons
                  }
                  <span
                    className={f('icon-type', {
                      ['icon-family']: entry.metadata.type === 'Family',
                      ['icon-domain']: entry.metadata.type === 'Domain',
                      ['icon-repeat']: entry.metadata.type === 'Repeat',
                      ['icon-hh']:
                        entry.metadata.type === 'Homologous Superfamily',
                      ['icon-site']: entry.metadata.type === 'Site',
                    })}
                  >
                    {entry.metadata.type === 'Family' ? 'F' : null}
                    {entry.metadata.type === 'Domain' ? 'D' : null}
                    {entry.metadata.type === 'Repeat' ? 'R' : null}
                    {entry.metadata.type === 'Homologous Superfamily'
                      ? 'H'
                      : null}
                    {entry.metadata.type === 'Site' ? 'S' : null}
                  </span>
                </interpro-type>
              </Tooltip>

              <div>
                <span className={f('card-title')}>{entry.metadata.name}</span>
              </div>

              <span className={f('name-ac')}>{entry.metadata.accession}</span>
            </Link>
          </div>

          <div
            // key={c}
            className={f('card-block', 'card-counter', 'label-off', 'label-h')}
          >
            {' '}
            <div className={f('count-4', 'count-proteins')}>
              <Tooltip
                title={`${numberToDisplayText(
                  entry.extra_fields.counters.proteins,
                  true,
                )} ${toPlural(
                  'protein',
                  entry.extra_fields.counters.proteins,
                )} matching ${entry.metadata.name}`}
              >
                <Link
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: {
                        db: 'InterPro',
                        accession: entry.metadata.accession,
                      },
                      protein: { isFilter: true, db: 'UniProt' },
                    },
                  }}
                  disabled={!entry.extra_fields.counters.proteins}
                >
                  <div
                    className={f('icon', 'icon-conceptual', 'icon-wrapper')}
                    data-icon="&#x50;"
                  >
                    <div className={f('icon-over-anim')} />
                  </div>
                  <NumberComponent abbr noTitle>
                    {entry.extra_fields.counters.proteins}
                  </NumberComponent>
                  <span className={f('label-number')}>
                    {toPlural('protein', entry.extra_fields.counters.proteins)}
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div className={f('count-4', 'count-architectures')}>
              <Tooltip
                title={`${numberToDisplayText(
                  entry.extra_fields.counters.domain_architectures,
                  true,
                )} ${toPlural(
                  'domain architecture',
                  entry.extra_fields.counters.domain_architectures,
                  true,
                )} matching ${entry.metadata.name}`}
              >
                <Link
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: {
                        db: 'InterPro',
                        accession: entry.metadata.accession,
                        detail: 'domain_architecture',
                      },
                    },
                  }}
                  disabled={!entry.extra_fields.counters.domain_architectures}
                >
                  <div className={f('icon', 'icon-count-ida', 'icon-wrapper')}>
                    <div className={f('icon-over-anim')} />
                  </div>
                  <NumberComponent abbr noTitle>
                    {entry.extra_fields.counters.domain_architectures}
                  </NumberComponent>
                  <span className={f('label-number')}>
                    domain architectures
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div className={f('count-4', 'count-organisms')}>
              <Tooltip
                title={`${numberToDisplayText(
                  entry.extra_fields.counters.taxa,
                  true,
                )} ${toPlural(
                  'taxonomy',
                  entry.extra_fields.counters.taxa,
                  true,
                )} matching ${entry.metadata.name}`}
              >
                <Link
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: {
                        db: 'InterPro',
                        accession: entry.metadata.accession,
                      },
                      taxonomy: { isFilter: true, db: 'uniprot' },
                    },
                  }}
                  disabled={!entry.extra_fields.counters.taxa}
                >
                  <div
                    className={f(
                      'icon',
                      'icon-count-organisms',
                      'icon-wrapper',
                    )}
                  >
                    <div className={f('icon-over-anim')} />
                  </div>
                  <NumberComponent abbr noTitle>
                    {entry.extra_fields.counters.taxa}
                  </NumberComponent>
                  <span className={f('label-number')}>
                    {toPlural('taxonomy', entry.extra_fields.counters.taxa)}
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div className={f('count-4', 'count-structures')}>
              <Tooltip
                title={`${numberToDisplayText(
                  entry.extra_fields.counters.structures,
                  true,
                )} ${toPlural(
                  'structure',
                  entry.extra_fields.counters.structures,
                )} matching ${entry.metadata.name}`}
              >
                <Link
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: {
                        db: 'InterPro',
                        accession: entry.metadata.accession,
                      },
                      structure: { isFilter: true, db: 'PDB' },
                    },
                  }}
                  disabled={!entry.extra_fields.counters.structures}
                >
                  <div
                    className={f('icon', 'icon-conceptual', 'icon-wrapper')}
                    data-icon="s"
                  >
                    {entry.extra_fields.counters.structures !== 0 && (
                      <div className={f('icon-over-anim')} />
                    )}
                  </div>
                  <NumberComponent abbr noTitle>
                    {entry.extra_fields.counters.structures}
                  </NumberComponent>
                  <span className={f('label-number')}>
                    {toPlural(
                      'structure',
                      entry.extra_fields.counters.structures,
                    )}
                  </span>
                </Link>
              </Tooltip>
            </div>
            {
              // OPTION COUNT SIGNATURES - ICON SVG
              Object.keys(entry.metadata.member_databases).map((key) => (
                <div
                  className={f('icon-count-signatures')}
                  key={Object.keys(entry.metadata.member_databases[key])[0]}
                >
                  <Tooltip
                    title={`${key} signature:  ${
                      Object.keys(entry.metadata.member_databases[key])[0]
                    }`}
                  >
                    {' '}
                    <MemberSymbol type={key} className={f('md-small')} />
                  </Tooltip>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default EntryCard;
