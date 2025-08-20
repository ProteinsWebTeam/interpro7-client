import React from 'react';

import Link from 'components/generic/Link';
import Card from 'components/SimpleCommonComponents/Card';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import SummaryCounterProteins from '../SummaryCounterProteins';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts);

type Props = {
  data: {
    metadata: ProteinMetadata;
    extra_fields?: {
      counters: MetadataCounters;
    };
  };
  search: string;
  entryDB: MemberDB | 'interpro';
};
const ProteinCard = ({ data, search, entryDB }: Props) => {
  return (
    <Card
      title={
        <>
          {data.metadata.source_database === 'reviewed' ? (
            <Tooltip title="Reviewed by UniProtKB curators">
              <span
                className={css('icon', 'icon-common')}
                data-icon="&#xf2f0;"
                aria-label="reviewed"
              />{' '}
            </Tooltip>
          ) : null}
          <Link
            to={{
              description: {
                main: { key: 'protein' },
                protein: {
                  db: data.metadata.source_database,
                  accession: data.metadata.accession,
                },
              },
            }}
          >
            <HighlightedText
              text={data.metadata.name as string}
              textToHighlight={search}
            />
          </Link>
        </>
      }
      subHeader={<span>{data.metadata.length} AA</span>}
      footer={
        <>
          <Tooltip
            title={`${data.metadata.source_organism.fullName} (Tax ID: ${data.metadata.source_organism.taxId})`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: {
                    db: 'uniprot',
                    accession: data.metadata.source_organism.taxId,
                  },
                },
              }}
            >
              {data.metadata.source_organism.fullName}
            </Link>
          </Tooltip>
          <div>
            <HighlightedText
              text={data.metadata.accession || ''}
              textToHighlight={search}
            />
          </div>
        </>
      }
    >
      {data.extra_fields ? (
        <SummaryCounterProteins
          proteinName={data.metadata.name as string}
          proteinAccession={data.metadata.accession}
          counters={data.extra_fields.counters}
          entryDB={entryDB}
        />
      ) : (
        <Loading />
      )}
    </Card>
  );
};

export default ProteinCard;
