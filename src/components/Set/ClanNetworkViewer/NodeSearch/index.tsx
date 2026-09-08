import React, { useMemo, useRef, useState } from 'react';

import cssBinder from 'styles/cssBinder';

import { ClanNetworkNode } from '../types';

import style from '../style.css';

const css = cssBinder(style);

const MAX_RESULTS = 10;

type Props = {
  nodes: Array<ClanNetworkNode>;
  onSelect: (accession: string) => void;
};

// Ranked so that what you are most likely to have typed comes first: an
// accession you pasted in full, then anything *starting* with the query, then
// anything containing it, and only then a hit in the long description -- which
// is the noisiest field and would otherwise crowd out the name matches.
const scoreNode = (node: ClanNetworkNode, query: string): number => {
  const accession = node.accession.toLowerCase();
  const shortName = (node.short_name || '').toLowerCase();
  if (accession === query) return 0;
  if (accession.startsWith(query) || shortName.startsWith(query)) return 1;
  if (accession.includes(query) || shortName.includes(query)) return 2;
  if ((node.name || '').toLowerCase().includes(query)) return 3;
  return Infinity;
};

export const searchNodes = (
  nodes: Array<ClanNetworkNode>,
  rawQuery: string,
): Array<ClanNetworkNode> => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  return nodes
    .map((node) => ({ node, score: scoreNode(node, query) }))
    .filter(({ score }) => score !== Infinity)
    .sort(
      (a, b) =>
        a.score - b.score ||
        // Stable, readable tie-break rather than whatever order the API used.
        (a.node.short_name || a.node.accession).localeCompare(
          b.node.short_name || b.node.accession,
        ),
    )
    .slice(0, MAX_RESULTS)
    .map(({ node }) => node);
};

const NodeSearch = ({ nodes, onSelect }: Props) => {
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchNodes(nodes, query), [nodes, query]);
  const showResults = isOpen && query.trim().length > 0;

  const select = (node?: ClanNetworkNode) => {
    if (!node) return;
    onSelect(node.accession);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      select(results[highlighted]);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!results.length) return;
    setIsOpen(true);
    setHighlighted((current) => {
      const next = current + (event.key === 'ArrowDown' ? 1 : -1);
      return (next + results.length) % results.length;
    });
  };

  return (
    <div className={css('clan-network-search')}>
      <input
        ref={inputRef}
        type="search"
        value={query}
        placeholder="Find an entry…"
        aria-label="Find an entry in this clan"
        role="combobox"
        aria-expanded={showResults}
        aria-controls="clanNetworkSearchResults"
        aria-autocomplete="list"
        aria-activedescendant={
          showResults && results[highlighted]
            ? `clanNetworkSearchResult-${results[highlighted].accession}`
            : undefined
        }
        onChange={(event) => {
          setQuery(event.target.value);
          setHighlighted(0);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        // Closing on blur alone would fire before a click on a result lands, so
        // the list swallows mousedown and keeps focus on the input instead.
        onBlur={() => setIsOpen(false)}
        onKeyDown={onKeyDown}
      />
      {showResults && (
        <ul
          id="clanNetworkSearchResults"
          role="listbox"
          className={css('clan-network-search-results', 'no-bullet')}
          onMouseDown={(event) => event.preventDefault()}
        >
          {results.length === 0 && (
            <li className={css('clan-network-search-empty')}>No match</li>
          )}
          {results.map((node, index) => (
            <li
              key={node.accession}
              id={`clanNetworkSearchResult-${node.accession}`}
              role="option"
              aria-selected={index === highlighted}
              className={css('clan-network-search-result', {
                'clan-network-search-result-active': index === highlighted,
              })}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => select(node)}
            >
              <span className={css('clan-network-search-name')}>
                {node.short_name || node.accession}
              </span>
              <span className={css('clan-network-search-accession')}>
                {node.accession}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NodeSearch;
