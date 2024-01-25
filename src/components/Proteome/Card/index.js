import React from 'react';
import T from 'prop-types';

import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';
// $FlowFixMe
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
// $FlowFixMe
import SummaryCounterProteome from 'components/Proteome/SummaryCounterProteome';

// $FlowFixMe
import SpeciesIcon from 'components/Organism/SpeciesIcon';

const ProteomeCard = (
  {
    data,
    search,
    entryDB,
  } /*: {data: Object, search: string, entryDB: string} */,
) => (
  <Card
    imageComponent={
      data.metadata &&
      data.metadata.lineage && (
        <SpeciesIcon lineage={data.metadata.lineage} fontSize="3rem" />
      )
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
        <HighlightedText
          text={data.metadata.name.name || data.metadata.name}
          textToHighlight={search}
        />
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
      proteomeName={data.metadata.name}
      proteomeAccession={data.metadata.accession}
      counters={data.metadata.counters || data.extra_fields.counters}
    />
  </Card>
);

ProteomeCard.propTypes = {
  data: dataPropType,
  search: T.string,
  entryDB: T.string,
};

export default ProteomeCard;
