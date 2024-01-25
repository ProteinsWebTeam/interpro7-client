import React from 'react';
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

type Props = {
  entryDB: MemberDB | 'interpro';
  entryName: string;
  entryAccession: string;
  counters: MetadataCounters;
  memberDBs?: ContributingEntries;
};

import cssBinder from 'styles/cssBinder';

import cardStyle from 'components/SimpleCommonComponents/Card/CounterIcon/styles.css';

const css = cssBinder(cardStyle);

const SummaryCounterEntries = ({
  entryDB,
  entryName,
  entryAccession,
  counters,
  memberDBs,
}: Props) => {
  const {
    proteins,
    domain_architectures: domainArchitectures,
    taxa,
    structures,
    sets,
  } = counters;

  return (
    <div className={css('card-counter-block')}>
      <CounterIcon
        endpoint="protein"
        count={proteins as number}
        name={entryName}
        to={{
          description: {
            main: { key: 'entry' },
            entry: {
              db: entryDB,
              accession: entryAccession,
            },
            protein: { isFilter: true, db: 'UniProt' },
          },
        }}
      />

      <CounterIcon
        endpoint="domain architecture"
        count={domainArchitectures as number}
        name={entryName}
        to={{
          description: {
            main: { key: 'entry' },
            entry: {
              db: entryDB,
              accession: entryAccession,
              detail: 'domain_architecture',
            },
          },
        }}
      />

      <CounterIcon
        endpoint="taxonomy"
        count={taxa as number}
        name={entryName}
        to={{
          description: {
            main: { key: 'entry' },
            entry: {
              db: entryDB,
              accession: entryAccession,
            },
            taxonomy: { isFilter: true, db: 'uniprot' },
          },
        }}
      />

      <CounterIcon
        endpoint="structure"
        count={structures as number}
        name={entryName}
        to={{
          description: {
            main: { key: 'entry' },
            entry: {
              db: entryDB,
              accession: entryAccession,
            },
            structure: { isFilter: true, db: 'PDB' },
          },
        }}
      />

      {
        // show sets counter + icon only when available
        entryDB.toLowerCase() === 'cdd' ||
        entryDB.toLowerCase() === 'pfam' ||
        entryDB.toLowerCase() === 'pirsf' ? (
          <CounterIcon
            endpoint="set"
            count={sets as number}
            name={entryName}
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: entryAccession,
                },
                set: { isFilter: true, db: entryDB },
              },
            }}
          />
        ) : null
      }
      {memberDBs &&
        // OPTION COUNT SIGNATURES - ICON SVG
        Object.keys(memberDBs).map((db) =>
          Object.keys(memberDBs[db]).map((acc) => (
            <CounterIcon
              endpoint="entry"
              count={1}
              name={entryName}
              db={db as MemberDB}
              signature={acc}
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db,
                    accession: acc,
                  },
                },
              }}
            />
          )),
        )}
    </div>
  );
};

export default SummaryCounterEntries;
