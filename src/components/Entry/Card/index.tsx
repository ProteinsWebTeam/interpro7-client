import React from 'react';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import Description from 'components/Description';
import MemberSymbol from '../MemberSymbol';
import SummaryCounterEntries from '../SummaryCounterEntries';

import cssBinder from 'styles/cssBinder';

import styles from './styles.css';

const css = cssBinder(styles);

const description2IDs = (description: string) =>
  (description.match(/"(PUB\d+)"/gi) || []).map((t) =>
    t.replace(/(^")|("$)/g, ''),
  );

type Props = {
  data: {
    metadata: EntryMetadata;
    extra_fields?: {
      counters: MetadataCounters;
      description: Array<StructuredDescription>;
      literature?: Record<string, Reference>;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
  showDescription?: boolean;
};
const EntryCard = ({
  data,
  search,
  entryDB,
  showDescription = true,
}: Props) => {
  const name =
    typeof data.metadata.name === 'string'
      ? data.metadata.name
      : data.metadata.name.name;

  let desc: StructuredDescription | undefined = undefined;
  let included: [string, Reference][] | undefined = undefined;
  if (showDescription) {
    const description = data.extra_fields?.description;
    const literature = data.extra_fields?.literature;
    if (description?.length) {
      desc = description[0];
      const citations = description2IDs(desc.text);
      included = Object.entries(literature || {})
        .filter(([id]) => citations.includes(id))
        .sort(
          (a, b) =>
            (desc as StructuredDescription).text.indexOf(a[0]) -
            (desc as StructuredDescription).text.indexOf(b[0]),
        );
    }
  }
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
        {showDescription &&
          (desc && included ? (
            <div className={css('new-card-description')}>
              <Description
                textBlocks={[desc]}
                literature={included}
                withoutIDs
              />
            </div>
          ) : (
            <Loading />
          ))}
      </div>
    </Card>
  );
};

export default EntryCard;
