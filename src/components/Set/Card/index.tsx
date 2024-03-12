import React from 'react';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import SummaryCounterSet from '../SummaryCounterSet';

type Props = {
  data: {
    metadata: SetMetadata;
    extra_fields?: {
      counters: MetadataCounters;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
};
const SetCard = ({ data, search, entryDB }: Props) => {
  const name =
    typeof data.metadata.name === 'string'
      ? data.metadata.name
      : data.metadata.name.name;
  return (
    <Card
      title={
        <Link
          to={{
            description: {
              main: { key: 'set' },
              set: {
                db: data.metadata.source_database,
                accession: `${data.metadata.accession}`,
              },
            },
          }}
        >
          <HighlightedText text={name} textToHighlight={search} />
        </Link>
      }
      footer={
        <HighlightedText
          text={data.metadata.accession || ''}
          textToHighlight={search}
        />
      }
    >
      <SummaryCounterSet
        entryDB={entryDB}
        setName={name}
        setDB={data.metadata.source_database}
        setAccession={data.metadata.accession}
        counters={
          (data && data.extra_fields && data.extra_fields.counters) || {}
        }
      />
    </Card>
  );
};

export default SetCard;
