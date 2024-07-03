import React from 'react';
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

type Props = {
  entryDB: MemberDB | 'interpro';
  setName: string;
  setDB: string;
  setAccession: string;
  counters: MetadataCounters;
};

import cssBinder from 'styles/cssBinder';

import cardStyle from 'components/SimpleCommonComponents/Card/CounterIcon/styles.css';

const css = cssBinder(cardStyle);

const SummaryCounterSets = ({
  entryDB,
  setDB,
  setName,
  setAccession,
  counters,
}: Props) => {
  const { entries, proteins, taxa, structures, proteomes } = counters;

  return (
    <div className={css('card-counter-block')}>
      <CounterIcon
        endpoint="entry"
        count={
          typeof entries === 'object' ? entries.total : (entries as number)
        }
        name={setName}
        db={entryDB}
        to={{
          description: {
            main: { key: 'set' },
            set: {
              db: setDB,
              accession: setAccession,
            },
            entry: { isFilter: true, db: entryDB && 'all' },
          },
        }}
      />
      <CounterIcon
        endpoint="protein"
        count={proteins as number}
        name={setName}
        to={{
          description: {
            main: { key: 'set' },
            set: {
              db: setDB,
              accession: setAccession,
            },
            protein: { isFilter: true, db: 'UniProt' },
          },
        }}
      />

      <CounterIcon
        endpoint="structure"
        count={structures as number}
        name={setName}
        to={{
          description: {
            main: { key: 'set' },
            set: {
              db: setDB,
              accession: setAccession,
            },
            structure: { isFilter: true, db: 'PDB' },
          },
        }}
      />
      <CounterIcon
        endpoint="taxonomy"
        count={taxa as number}
        name={setName}
        to={{
          description: {
            main: { key: 'set' },
            set: {
              db: setDB,
              accession: setAccession,
            },
            taxonomy: { isFilter: true, db: 'uniprot' },
          },
        }}
      />

      <CounterIcon
        endpoint="proteome"
        count={proteomes as number}
        name={setName}
        to={{
          description: {
            main: { key: 'set' },
            set: {
              db: setDB,
              accession: setAccession,
            },
            proteome: { isFilter: true, db: 'uniprot' },
          },
        }}
      />
    </div>
  );
};

export default SummaryCounterSets;
