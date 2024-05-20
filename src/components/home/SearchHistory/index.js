// @flow
import React, { useState, useEffect } from 'react';

import searchStorage from 'storage/searchStorage';
import Link from 'components/generic/Link';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import theme from 'styles/theme-interpro.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import styles from './styles.css';

const f = foundationPartial(ebiGlobalStyles, theme, ipro, styles);

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
    <>
      <div className={f('row')}>
        <div className={f('search-terms-div')}>
          {searchTerms.map((term) => (
            <div className={f('tag', 'search-term')} key={term}>
              <button
                className={f('remove-term')}
                onClick={() => removeTerm(term)}
              >
                ✖
              </button>
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
                className={f('search-link')}
              >
                <span>{term}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {searchTerms.length > 0 ? (
        <div className={f('row')}>
          <div className={f('column')}>
            <Button type="tertiary" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
        </div>
      ) : (
        <Callout type="info">
          <span style={{ fontWeight: 'bold' }}>
            There has been no recent searches.
          </span>
        </Callout>
      )}
    </>
  );
};

export default SearchHistory;
