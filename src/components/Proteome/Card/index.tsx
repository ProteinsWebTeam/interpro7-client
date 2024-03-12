import React from 'react';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import SummaryCounterProteome from 'components/Proteome/SummaryCounterProteome';
import SpeciesIcon from 'components/Organism/SpeciesIcon';

type Props = {
  data: {
    metadata: ProteomeMetadata;
    extra_fields?: {
      counters: MetadataCounters;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
};
const ProteomeCard = ({ data, search, entryDB }: Props) => {
  const name =
    typeof data.metadata.name === 'string'
      ? data.metadata.name
      : data.metadata.name.name;
  return (
    <Card
      imageComponent={
        data?.metadata?.lineage ? (
          <SpeciesIcon lineage={data.metadata.lineage} fontSize="3rem" />
        ) : undefined
      }
      title={
        <Link
          to={{
            description: {
              main: { key: 'proteome' },
              proteome: {
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
      <SummaryCounterProteome
        entryDB={entryDB}
        proteomeName={name}
        proteomeAccession={data.metadata.accession}
        counters={data.metadata.counters || data.extra_fields?.counters}
      />
    </Card>
  );
};

export default ProteomeCard;
