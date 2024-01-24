import React from 'react';
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

type Props = {
  entryDB: MemberDB;
  proteinName: string;
  proteinAccession: string;
  counters: MetadataCounters;
};

import cssBinder from 'styles/cssBinder';

import cardStyle from 'components/SimpleCommonComponents/Card/CounterIcon/styles.css';

const css = cssBinder(cardStyle);

const SummaryCounterProteins = ({
  entryDB,
  proteinName,
  proteinAccession,
  counters,
}: Props) => {
  const { entries, structures } = counters;

  return (
    <div className={css('card-counter-block')}>
      <CounterIcon
        endpoint="entry"
        count={entries as number}
        name={proteinName}
        db={entryDB}
        to={{
          description: {
            main: { key: 'protein' },
            protein: {
              db: 'uniprot',
              accession: proteinAccession,
            },
            entry: { isFilter: true, db: entryDB || 'all' },
          },
        }}
      />
      <CounterIcon
        endpoint="structure"
        count={structures as number}
        name={proteinName}
        to={{
          description: {
            main: { key: 'protein' },
            protein: {
              db: 'uniprot',
              accession: proteinAccession,
            },
            structure: { isFilter: true, db: 'PDB' },
          },
        }}
      />
    </div>
  );
};
export default SummaryCounterProteins;
