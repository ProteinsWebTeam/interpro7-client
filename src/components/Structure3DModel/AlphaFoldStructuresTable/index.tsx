import React, { useState } from 'react';
import cssBinder from 'styles/cssBinder';
import tableStyles from 'components/Table/style.css';
import localStyles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(tableStyles, localStyles, fonts);

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
    <div className={css('alphafold-structures-table')}>
      <h5 className={css('title')}>
        <span>Available structures ({docs.length})</span>
        <button
          onClick={() => setIsVisible((v) => !v)}
          className={css('toggle-button')}
          aria-label={isVisible ? 'Collapse table' : 'Expand table'}
          title={isVisible ? 'Collapse table' : 'Expand table'}
        >
          <span
            className={css(
              'icon',
              'icon-common',
              isVisible ? 'icon-chevron-up' : 'icon-chevron-down',
            )}
            data-icon={isVisible ? '\uF077' : '\uF078'}
          />
        </button>
      </h5>
      {isVisible && (
        <div className={css('table-scroll-area')}>
          <table className={css('light', 'structures-table')}>
            <thead>
              <tr>
                <th className={css('table-header-cell')}>Model name</th>
                <th className={css('table-header-cell')}>UniProt start</th>
                <th className={css('table-header-cell')}>UniProt end</th>
                <th className={css('table-header-cell')}>Provider</th>
                <th className={css('table-header-cell')}>Oligomeric state</th>
              </tr>
            </thead>
            <tbody>
              {sortedDocs.map((doc) => (
                <tr
                  key={doc.entryId}
                  onClick={() => onSelect(doc.entryId)}
                  className={css({
                    'structure-row': true,
                    selected: doc.entryId === selectedId,
                  })}
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
        </div>
      )}
    </div>
  );
};

export default AlphaFoldStructuresTable;
