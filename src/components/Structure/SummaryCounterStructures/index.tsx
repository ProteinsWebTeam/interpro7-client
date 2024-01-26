import React from 'react';
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

type Props = {
  entryDB: MemberDB | 'interpro';
  structureName: string;
  structureAccession: string;
  counters: MetadataCounters;
};

import cssBinder from 'styles/cssBinder';

import cardStyle from 'components/SimpleCommonComponents/Card/CounterIcon/styles.css';

const css = cssBinder(cardStyle);

const SummaryCounterStructures = ({
  entryDB,
  structureName,
  structureAccession,
  counters,
}: Props) => {
  const { entries, proteins, taxa } = counters;

  return (
    <div className={css('card-counter-block')}>
      <CounterIcon
        endpoint="entry"
        count={entries as number}
        name={structureName}
        db={entryDB}
        to={{
          description: {
            main: { key: 'structure' },
            structure: {
              db: 'pdb',
              accession: structureAccession,
            },
            entry: { isFilter: true, db: entryDB || 'all' },
          },
        }}
      />
      <CounterIcon
        endpoint="protein"
        count={proteins as number}
        name={structureName}
        to={{
          description: {
            main: { key: 'structure' },
            structure: {
              db: 'pdb',
              accession: structureAccession,
            },
            protein: { isFilter: true, db: 'UniProt' },
          },
        }}
      />
      <CounterIcon
        endpoint="taxonomy"
        count={taxa as number}
        name={structureName}
      />{' '}
    </div>
  );
};
export default SummaryCounterStructures;
