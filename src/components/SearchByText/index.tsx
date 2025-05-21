import React, { useEffect, useRef, useState } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import loadable from 'higherOrder/loadable';
import TextSearchBox, {
  DEBOUNCE_RATE,
  DEBOUNCE_RATE_SLOW,
} from 'components/SearchByText/TextSearchBox';
import Example from 'components/SearchByText/Example';
import Link from 'components/generic/Link';
import Button from 'components/SimpleCommonComponents/Button';
import getURLByAccession from 'utils/processDescription/getURLbyAccession';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { schemaProcessDataPageSection } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import blocks from 'styles/blocks.css';
import local from './style.css';
import searchPageCss from 'pages/Search/style.css';

const css = cssBinder(local, blocks, searchPageCss);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type Props = { main?: string };

export const SearchByText = ({ main }: Props) => {
  const input = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [directLink, setDirectLink] = useState<string | null>(null);

  const handleValueChange = (value: string) => {
    setSearchValue(value);
    const directLinkDescription = getURLByAccession(value);
    if (directLinkDescription) {
      const path = descriptionToPath(directLinkDescription);
      const url = new URL(window.location.origin);
      url.pathname = new URL(`/interpro/${path}`, url).pathname;
      console.log(url);
      setDirectLink(url.toString());
    } else {
      setDirectLink(null);
    }
  };

  const clearText = () => {
    if (input.current) {
      (input.current as { state: { localValue: string } })['state'][
        'localValue'
      ] = '';
    }
    handleValueChange('');
  };

  useEffect(() => {
    if (main === 'search') {
      (input.current as unknown as { focus: () => void })?.focus();
    }
  }, [main]);
  return (
    <section className={css('vf-stack', 'vf-stack--400')}>
      <SchemaOrgData
        data={{
          name: 'Search By Text',
          description:
            'Search families, domains, proteins, keywords or GO terms',
        }}
        processData={schemaProcessDataPageSection}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        data-category="navigation"
      >
        <div className={css('simple-box')}>
          <header>
            Search by protein families, domains, proteins, keywords, or GO terms
          </header>
          <div className={css('vf-stack', 'vf-stack--200')}>
            <TextSearchBox
              ref={input}
              delay={main === 'search' ? DEBOUNCE_RATE : DEBOUNCE_RATE_SLOW}
              setSearchValue={handleValueChange}
            />
            <div className={css('examples')}>
              <span>
                {' '}
                Examples:
                <Example>IPR020422</Example>,<Example>kinase</Example>,
                <Example>O00167</Example>,<Example>PF02932</Example>,
                <Example>GO:0007165</Example>,<Example>1t2v</Example>,
                <Example>UP000005640</Example>
              </span>
            </div>
          </div>

          <footer>
            <div>
              <Link
                buttonType="primary"
                to={
                  !directLink
                    ? {
                        description: {
                          main: { key: 'search' },
                          search: {
                            type: 'text',
                            value: searchValue,
                          },
                        },
                      }
                    : null
                }
                href={directLink}
              >
                Search
              </Link>
              <Link
                onClick={clearText}
                buttonType="secondary"
                to={{
                  description: {
                    main: { key: 'search' },
                    search: { type: 'text' },
                  },
                }}
              >
                Clear
              </Link>
            </div>
            <div className={css('search-adv')}>
              <span>
                Powered by{' '}
                <Link
                  className={css('neutral', 'ext')}
                  target="_blank"
                  href="https://www.ebi.ac.uk/ebisearch/"
                >
                  EBI search
                </Link>
              </span>
            </div>
          </footer>
        </div>
      </form>
    </section>
  );
};

const mapStateToProps2 = createSelector(
  (state: GlobalState) => state.customLocation.description.main.key!,
  (main) => ({ main }),
);

export default connect(mapStateToProps2)(SearchByText);
