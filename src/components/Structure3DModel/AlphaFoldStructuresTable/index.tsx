import React, { useState } from 'react';
import cssBinder from 'styles/cssBinder';
import tableStyles from 'components/Table/style.css';

const css = cssBinder(tableStyles);

type Props = {
  docs: AlphafoldSearchDoc[];
  onSelect: (entryId: string) => void;
  selectedId: string | null;
};

const AlphaFoldStructuresTable = ({ docs, onSelect, selectedId }: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  if (docs.length === 0) return null;

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
            {docs.map((doc) => (
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
                <td>{doc.oligomericState || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AlphaFoldStructuresTable;
