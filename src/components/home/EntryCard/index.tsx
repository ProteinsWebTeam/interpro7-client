import React, { PureComponent } from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Card from 'components/SimpleCommonComponents/Card';
import Link from 'components/generic/Link';
import SummaryCounterEntries from 'components/Entry/SummaryCounterEntries';

import loadWebComponent from 'utils/load-web-component';

import cssBinder from 'styles/cssBinder';

import icons from 'styles/icons.css';

const f = cssBinder(icons);

type Props = {
  entry: {
    metadata: EntryMetadata;
    extra_fields: {
      counters: MetadataCounters;
    };
  };
};

export class EntryCard extends PureComponent<Props> {
  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }

  render() {
    const { entry } = this.props;
    const name =
      typeof entry.metadata.name === 'string'
        ? entry.metadata.name
        : entry.metadata.name.name;
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
              <span>{name}</span>
            </Link>
          </>
        }
        subHeader={entry.metadata.accession}
      >
        <SummaryCounterEntries
          entryDB="interpro"
          entryName={name}
          entryAccession={entry.metadata.accession}
          counters={entry.extra_fields.counters}
          memberDBs={entry.metadata.member_databases}
        />
      </Card>
    );
  }
}

export default EntryCard;
