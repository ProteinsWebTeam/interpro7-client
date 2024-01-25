import React, { PureComponent } from 'react';
import T from 'prop-types';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import Card from 'components/SimpleCommonComponents/Card';

import Link from 'components/generic/Link';
import SummaryCounterEntries from 'components/Entry/SummaryCounterEntries';

import loadWebComponent from 'utils/load-web-component';

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
      <Card
        compact={true}
        title={
          <>
            <Tooltip title={`${entry.metadata.type} type`}>
              <interpro-type
                dimension="1.5em"
                type={entry.metadata.type.replace('_', ' ')}
                role="link"
                aria-label={`Entry type ${entry.metadata.type}`}
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
              <span className={f('card-title')}>{entry.metadata.name}</span>
            </Link>
          </>
        }
        subHeader={entry.metadata.accession}
      >
        <SummaryCounterEntries
          entryDB="interpro"
          entryName={entry.metadata.name}
          entryAccession={entry.metadata.accession}
          counters={entry.extra_fields.counters}
          memberDBs={entry.metadata.member_databases}
        />
      </Card>
    );
  }
}

export default EntryCard;
