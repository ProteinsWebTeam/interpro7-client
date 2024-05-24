import React, { useEffect, useRef } from 'react';

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
      <form onSubmit={(e) => e.preventDefault()} data-category="navigation">
        <div className={css('simple-box')}>
          <header>
            Search by protein families, domains, proteins, keywords, or GO terms
          </header>
          <div className={css('vf-stack', 'vf-stack--200')}>
            <TextSearchBox
              ref={input}
              delay={main === 'search' ? DEBOUNCE_RATE : DEBOUNCE_RATE_SLOW}
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
              <Button submit style={{ marginRight: '0.2rem' }}>
                Search
              </Button>
              <Link
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
  (state: GlobalState) => state.customLocation.description.main.key,
  (main) => ({ main }),
);

export default connect(mapStateToProps2)(SearchByText);
