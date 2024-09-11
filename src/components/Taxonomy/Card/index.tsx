import React from 'react';

import getNodeSpotlight from 'utils/taxonomy/get-node-spotlight';
import getSuperKingdom from 'utils/taxonomy/get-super-kingdom';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import SpeciesIcon from 'components/Organism/SpeciesIcon';
import SummaryCounterOrg from '../SummaryCounterOrg';

const Lineage = ({ lineage }: { lineage: string }) => {
  const superkingdom = getSuperKingdom(lineage) || 'N/A';
  const nodespot = getNodeSpotlight(lineage);
  return (
    <Tooltip title={`Lineage: ${lineage}`}>
      {superkingdom} {nodespot && `(${nodespot})`}
    </Tooltip>
  );
};

type Props = {
  data: {
    metadata: TaxonomyMetadata;
    extra_fields?: {
      counters: MetadataCounters;
      lineage?: string;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
};
const TaxonomyCard = ({ data, search, entryDB }: Props) => {
  const name =
    typeof data.metadata.name === 'string'
      ? data.metadata.name
      : data.metadata.name.name;
  return (
    <Card
      imageComponent={
        data.extra_fields?.lineage ? (
          <SpeciesIcon lineage={data.extra_fields.lineage} fontSize="3rem" />
        ) : undefined
      }
      title={
        <Link
          to={{
            description: {
              main: { key: 'taxonomy' },
              taxonomy: {
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
        <>
          {data?.extra_fields?.lineage && (
            <Lineage lineage={data.extra_fields.lineage} />
          )}
          <div>
            Tax ID:{' '}
            <HighlightedText
              text={data.metadata.accession}
              textToHighlight={search}
            />
          </div>
        </>
      }
    >
      <SummaryCounterOrg
        entryDB={entryDB}
        taxName={name}
        taxAccession={data.metadata.accession}
        counters={data?.extra_fields?.counters || {}}
      />
    </Card>
  );
};

export default TaxonomyCard;
