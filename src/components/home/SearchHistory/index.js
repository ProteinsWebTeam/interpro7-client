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

  const removeTerm = (term) => {
    const currentValues = searchStorage.getValue();
    currentValues.splice(currentValues.indexOf(term), 1);
    searchStorage.setValue(currentValues);
    setSearchTerms(currentValues);
  };

  useEffect(() => {
    if (searchStorage && searchStorage.getValue())
      setSearchTerms(searchStorage.getValue());
    else setSearchTerms([]);
  }, []);
  return (
    <div className={f('search-terms-div')}>
      <div className={f('row')}>
        {searchTerms.map((term) => (
          <>
            <div className={f('search-term')} key={term}>
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
              >
                <span>{term}</span>
              </Link>
            </div>
            <button className={f('close')} onClick={() => removeTerm(term)}>
              ✖
            </button>
          </>
        ))}
      </div>
      {searchTerms.length > 0 ? (
        <div className={f('row')}>
          <button
            className={f('button', 'clear-history')}
            onClick={clearHistory}
          >
            Clear History
          </button>
        </div>
      ) : (
        <div className={f('callout', 'info', 'withicon')}>
          <span style={{ fontWeight: 'bold' }}>
            There has been no recent searches.
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
