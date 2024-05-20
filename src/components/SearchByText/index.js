// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import loadable from 'higherOrder/loadable';
import TextSearchBox, {
  DEBOUNCE_RATE,
  DEBOUNCE_RATE_SLOW,
} from 'components/SearchByText/TextSearchBox';
import Example from 'components/SearchByText/Example';
import Link from 'components/generic/Link';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import blocks from 'styles/blocks.css';
import local from './style.css';

const f = foundationPartial(interproTheme, ipro, local, blocks);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*:: type Props = { main: string }; */

export class SearchByText extends PureComponent /*:: <Props> */ {
  /*:: _input: { current: null | React$ElementRef<'div'> }; */
  static propTypes = {
    main: T.string,
  };

  constructor(props) {
    super(props);
    this._input = React.createRef();
  }

  componentDidMount() {
    // Only focus if on the search page (not on home page)
    if (this._input && this.props.main === 'search') {
      this._input?.current?.focus();
    }
  }

  render() {
    return (
      <div className={f('row')}>
        <SchemaOrgData
          data={{
            name: 'Search By Text',
            description:
              'Search families, domains, proteins, keywords or GO terms',
          }}
          processData={schemaProcessDataPageSection}
        />
        <div className={f('large-12', 'columns', 'margin-bottom-medium')}>
          <form onSubmit={(e) => e.preventDefault()} data-category="navigation">
            <div className={f('simple-box', 'border', 'margin-bottom-none')}>
              <div className={f('row')}>
                <div className={f('large-12', 'columns', 'search-input')}>
                  <h3 className={f('light')}>
                    Search families, domains, proteins, keywords or GO terms
                  </h3>
                  <TextSearchBox
                    ref={this._input}
                    delay={
                      this.props.main === 'search'
                        ? DEBOUNCE_RATE
                        : DEBOUNCE_RATE_SLOW
                    }
                  />
                </div>
              </div>

              <div className={f('row')}>
                <div
                  className={f('medium-8', 'columns', 'neutral')}
                  style={{
                    float: 'none', // overwriting this to make the whole block play nice in flex
                  }}
                >
                  <span>
                    {' '}
                    e.g.
                    <Example>IPR020422</Example>,<Example>kinase</Example>,
                    <Example>O00167</Example>,<Example>PF02932</Example>,
                    <Example>GO:0007165</Example>,<Example>1t2v</Example>,
                    <Example>UP000005640</Example>
                  </span>
                </div>
                <div
                  className={f(
                    'medium-4',
                    'columns',
                    'show-for-medium',
                    'search-adv',
                  )}
                >
                  <span>
                    Powered by{' '}
                    <Link
                      className={f('neutral', 'ext')}
                      target="_blank"
                      href="https://www.ebi.ac.uk/ebisearch/"
                    >
                      EBI search
                    </Link>
                  </span>
                </div>
              </div>

              <div className={f('row', 'action-row')}>
                <div
                  className={f(
                    'large-9',
                    'columns',
                    'stacked-for-small',
                    'margin-bottom-none',
                    'button-group',
                  )}
                >
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
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps2 = createSelector(
  (state) => state.customLocation.description.main.key,
  (main) => ({ main }),
);

export default connect(mapStateToProps2)(SearchByText);
