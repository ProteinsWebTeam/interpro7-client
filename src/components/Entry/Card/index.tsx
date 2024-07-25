import React from 'react';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import MemberSymbol from '../MemberSymbol';
import SummaryCounterEntries from '../SummaryCounterEntries';

import cssBinder from 'styles/cssBinder';

import styles from './styles.css';

const css = cssBinder(styles);
type Props = {
  data: {
    metadata: EntryMetadata;
    extra_fields?: {
      counters: MetadataCounters;
      literature?: Record<string, Reference>;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
};
const EntryCard = ({ data, search, entryDB }: Props) => {
  const name =
    typeof data.metadata.name === 'string'
      ? data.metadata.name
      : data.metadata.name.name;
  return (
    <Card
      imageComponent={
        entryDB.toLowerCase() === 'interpro' ? (
          <Tooltip title={`${data.metadata.type.replace('_', ' ')} type`}>
            <interpro-type
              dimension="2em"
              type={data.metadata.type.replace('_', ' ')}
              aria-label="Entry type"
            />
          </Tooltip>
        ) : (
          <Tooltip title={`${entryDB} database`}>
            <MemberSymbol
              // size="2em"
              type={entryDB}
              aria-label="Database type"
              className={css('md-small')}
            />
          </Tooltip>
        )
      }
      title={
        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: {
                db: data.metadata.source_database,
                accession: data.metadata.accession,
              },
            },
          }}
        >
          <HighlightedText text={name || ''} textToHighlight={search} />
        </Link>
      }
      footer={
        <>
          {entryDB.toLowerCase() === 'interpro' ? (
            <div>{data.metadata.type.replace('_', ' ')}</div>
          ) : (
            <div>
              {data.metadata.integrated ? (
                <div>
                  Integrated into{' '}
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: data.metadata.integrated,
                        },
                      },
                    }}
                  >
                    {data.metadata.integrated}
                  </Link>
                </div>
              ) : (
                'Not integrated'
              )}
            </div>
          )}
          <div>
            <HighlightedText
              text={data.metadata.accession || ''}
              textToHighlight={search}
            />
          </div>
        </>
      }
    >
      <div>
        {data.extra_fields ? (
          <SummaryCounterEntries
            entryDB={entryDB}
            entryAccession={data.metadata.accession}
            entryName={name}
            counters={data.extra_fields.counters}
          />
        ) : (
          <Loading />
        )}
      </div>
    </Card>
  );
};
export default EntryCard;
