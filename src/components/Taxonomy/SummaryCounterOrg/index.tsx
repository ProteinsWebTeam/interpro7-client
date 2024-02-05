import React from 'react';
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

type Props = {
  entryDB: MemberDB | 'interpro';
  taxName: string;
  taxAccession: string;
  counters: MetadataCounters;
};

import cssBinder from 'styles/cssBinder';

import cardStyle from 'components/SimpleCommonComponents/Card/CounterIcon/styles.css';

const css = cssBinder(cardStyle);

const SummaryCounterOrg = ({
  entryDB,
  taxName,
  taxAccession,
  counters,
}: Props) => {
  const { entries, proteins, structures, proteomes } = counters;

  return (
    <div className={css('card-counter-block')}>
      <CounterIcon
        endpoint="entry"
        count={entries as number}
        name={taxName}
        db={entryDB}
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: {
              db: 'uniprot',
              accession: taxAccession,
            },
            entry: { isFilter: true, db: entryDB || 'all' },
          },
        }}
      />
      <CounterIcon
        endpoint="protein"
        count={proteins as number}
        name={taxName}
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: {
              db: 'uniprot',
              accession: taxAccession,
            },
            protein: { isFilter: true, db: 'UniProt' },
          },
        }}
      />

      <CounterIcon
        endpoint="structure"
        count={structures as number}
        name={taxName}
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: {
              db: 'uniprot',
              accession: taxAccession,
            },
            structure: { isFilter: true, db: 'PDB' },
          },
        }}
      />
      <CounterIcon
        endpoint="proteome"
        count={proteomes as number}
        name={taxName}
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: {
              db: 'uniprot',
              accession: taxAccession,
            },
            proteome: { isFilter: true, db: 'uniprot' },
          },
        }}
      />
    </div>
  );
};

export default SummaryCounterOrg;
