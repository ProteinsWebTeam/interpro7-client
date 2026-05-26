import React, { useState } from 'react';
import cssBinder from 'styles/cssBinder';
import tableStyles from 'components/Table/style.css';

const css = cssBinder(tableStyles);

type Props = {
  docs: AlphafoldSearchDoc[];
  onSelect: (entryId: string) => void;
  selectedId: string | null;
};

const oligomericStateOrder = (state: string): number => {
  const s = (state || '').toLowerCase();
  if (s === 'monomer') return 0;
  if (s.includes('dimer')) return 1;
  return 2;
};

const AlphaFoldStructuresTable = ({ docs, onSelect, selectedId }: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  if (docs.length === 0) return null;

  const sortedDocs = [...docs].sort((a, b) => {
    const providerA = (a.provider || 'AlphaFold').toLowerCase();
    const providerB = (b.provider || 'AlphaFold').toLowerCase();
    const providerOrder = (p: string) => (p === 'alphafold' ? 0 : 1);
    if (providerOrder(providerA) !== providerOrder(providerB))
      return providerOrder(providerA) - providerOrder(providerB);
    return (
      oligomericStateOrder(a.oligomericState) -
      oligomericStateOrder(b.oligomericState)
    );
  });

  return (
    <div>
      <h5>
        Available structures ({docs.length}){' '}
        <button
          onClick={() => setIsVisible((v) => !v)}
          style={{
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            color: 'inherit',
            textDecoration: 'underline',
            padding: 0,
            fontSize: '0.85em',
          }}
        >
          [{isVisible ? 'Hide' : 'Show'}]
        </button>
      </h5>
      {isVisible && (
        <table className={css('light')}>
          <thead>
            <tr>
              <th>Model name</th>
              <th>UniProt start</th>
              <th>UniProt end</th>
              <th>Provider</th>
              <th>Oligomeric state</th>
            </tr>
          </thead>
          <tbody>
            {sortedDocs.map((doc) => (
              <tr
                key={doc.entryId}
                onClick={() => onSelect(doc.entryId)}
                style={{
                  cursor: 'pointer',
                  fontWeight: doc.entryId === selectedId ? 'bold' : 'normal',
                }}
              >
                <td>{doc.entryId}</td>
                <td>{doc.uniprotStart}</td>
                <td>{doc.uniprotEnd}</td>
                <td>{doc.provider || 'AlphaFold'}</td>
                <td>
                  {doc.assemblyType
                    ? doc.assemblyType + doc.oligomericState
                    : String(doc.oligomericState).charAt(0).toUpperCase() +
                      String(doc.oligomericState).slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AlphaFoldStructuresTable;
