// @flow
import React, { useState, useEffect } from 'react';

import searchStorage from 'storage/searchStorage';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, styles);

export const SearchHistory = () => {
  const [searchTerms, setSearchTerms] = useState([]);
  const clearHistory = () => {
    searchStorage.setValue([]);
    setSearchTerms([]);
  };

  useEffect(() => {
    if (searchStorage && searchStorage.getValue())
      setSearchTerms(searchStorage.getValue());
    else setSearchTerms([]);
  }, []);
  return (
    <div className={f('search-terms-div')}>
      <div className={f('row')}>
        <div className={f('flex-column')}>
          {searchTerms.map((term) => (
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: {
                    type: 'text',
                    value: term,
                  },
                },
              }}
              className={f('columns', 'medium-4', 'text-center', 'block')}
              key={term}
            >
              <div className={f('flex-card')} key={term}>
                <div className={f('card-content')}>
                  <div className={f('card-title')}>
                    <h4>{term}</h4>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {searchTerms.length > 0 ? (
          <button className={f('button')} onClick={clearHistory}>
            Clear History
          </button>
        ) : (
          <div className={f('callout', 'info', 'withicon')}>
            <span style={{ fontWeight: 'bold' }}>
              There has been no recent searches.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
