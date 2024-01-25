import React from 'react';
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

type Props = {
  entryDB: MemberDB;
  proteomeName: string;
  proteomeAccession: string;
  counters: MetadataCounters;
};

import cssBinder from 'styles/cssBinder';

import cardStyle from 'components/SimpleCommonComponents/Card/CounterIcon/styles.css';

const css = cssBinder(cardStyle);

const SummaryCounterProteome = ({
  entryDB,
  proteomeName,
  proteomeAccession,
  counters,
}: Props) => {
  const { entries, proteins, structures } = counters;

  return (
    <div className={css('card-counter-block')}>
      <CounterIcon
        endpoint="entry"
        count={entries as number}
        name={proteomeName}
        db={entryDB}
        to={{
          description: {
            main: { key: 'proteome' },
            proteome: {
              db: 'uniprot',
              accession: proteomeAccession,
            },
            entry: { isFilter: true, db: entryDB && 'all' },
          },
        }}
      />
      <CounterIcon
        endpoint="protein"
        count={proteins as number}
        name={proteomeName}
        to={{
          description: {
            main: { key: 'proteome' },
            proteome: {
              db: 'uniprot',
              accession: proteomeAccession,
            },
            protein: { isFilter: true, db: 'UniProt' },
          },
        }}
      />

      <CounterIcon
        endpoint="structure"
        count={structures as number}
        name={proteomeName}
        to={{
          description: {
            main: { key: 'proteome' },
            proteome: {
              db: 'uniprot',
              accession: proteomeAccession,
            },
            structure: { isFilter: true, db: 'PDB' },
          },
        }}
      />
    </div>
  );
};

export default SummaryCounterProteome;
