import React from 'react';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import LazyImage from 'components/LazyImage';
import SummaryCounterStructures from '../SummaryCounterStructures';
import TaxnameStructures from './TaxnameStructures';
import Lazy from 'wrappers/Lazy';

type Props = {
  data: {
    metadata: StructureMetadata;
    extra_fields?: {
      counters: MetadataCounters;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
};
const StructureCard = ({ data, search, entryDB }: Props) => {
  return (
    <Card
      title={
        <Link
          to={{
            description: {
              main: { key: 'structure' },
              structure: {
                db: data.metadata.source_database,
                accession: data.metadata.accession,
              },
            },
          }}
        >
          <HighlightedText text={data.metadata.name} textToHighlight={search} />
        </Link>
      }
      imageComponent={
        <Tooltip
          title={`3D visualisation for ${data.metadata.accession} structure`}
        >
          <LazyImage
            src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${data.metadata.accession}&file=traces.jpg`}
            alt={`structure with accession ${data.metadata.accession}`}
          />
        </Tooltip>
      }
      subHeader={
        <>
          {
            // INFO RESOLUTION BL - browse structures - Xray
            data.metadata.experiment_type === 'x-ray' && (
              <Tooltip
                title={`X-ray, resolution ${data.metadata.resolution} Å`}
              >
                {data.metadata.experiment_type}
                {': '}
                {data.metadata.resolution}Å
              </Tooltip>
            )
          }
          {
            // INFO TYPE BL - browse structures -NMR
            data.metadata.experiment_type === 'nmr' && (
              <Tooltip title="Nuclear Magnetic Resonance">
                {data.metadata.experiment_type}
              </Tooltip>
            )
          }
        </>
      }
      footer={
        <>
          <Lazy>
            {(hasBeenVisible: boolean) =>
              hasBeenVisible ? (
                <TaxnameStructures accession={data.metadata.accession} />
              ) : null
            }
          </Lazy>
          <div>
            <HighlightedText
              text={data.metadata.accession || ''}
              textToHighlight={search}
            />
          </div>
        </>
      }
    >
      {data.extra_fields && data.metadata && data.extra_fields.counters && (
        <SummaryCounterStructures
          structureName={data.metadata.name as string}
          structureAccession={data.metadata.accession}
          entryDB={entryDB}
          counters={data.extra_fields.counters}
        />
      )}
    </Card>
  );
};

export default StructureCard;
