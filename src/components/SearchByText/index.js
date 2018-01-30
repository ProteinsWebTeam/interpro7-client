// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import TextSearchBox from 'components/SearchByText/TextSearchBox';
import Example from 'components/SearchByText/Example';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { changeSettings } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, ipro, local);

class _Settings extends PureComponent {
  static propTypes = {
    autoRedirect: T.bool.isRequired,
    changeSettings: T.func.isRequired,
  };

  render() {
    return (
      <div className={f('large-3', 'columns', 'settings')}>
        <Tooltip
          interactive
          useContext
          className={f('float-right')}
          html={
            <React.Fragment>
              <span>
                This will take you to the corresponding page if there is an
                exact match.
              </span>
              <br />
              <span>
                {'This can also be changed in the '}
                <Link
                  className={f('link-in-tooltip')}
                  to={{ description: { other: ['settings'] } }}
                >
                  Settings
                </Link>
                {' page'}
              </span>
            </React.Fragment>
          }
        >
          <span className={f('visible-label')}>auto redirect</span>
          <span className={f('switch', 'tiny')}>
            <input
              onChange={this.props.changeSettings}
              type="checkbox"
              checked={this.props.autoRedirect}
              className={f('switch-input')}
              name="autoRedirect"
              id="autoRedirect-input"
            />
            <label className={f('switch-paddle')} htmlFor="autoRedirect-input">
              <span className={f('show-for-sr')}>Automatic redirect:</span>
              <span className={f('switch-active')} aria-hidden="true">
                On
              </span>
              <span className={f('switch-inactive')} aria-hidden="true">
                Off
              </span>
            </label>
          </span>
        </Tooltip>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.navigation.autoRedirect,
  autoRedirect => ({ autoRedirect }),
);

const Settings = connect(mapStateToProps, { changeSettings })(_Settings);

class SearchByText extends PureComponent {
  static propTypes = {
    main: T.string,
  };

  componentDidMount() {
    // Only focus if on the search page (not on home page)
    if (this._input && this.props.main === 'search') {
      const { length } = this._input.value;
      this._input.focus();
      this._input.setSelectionRange(length, length);
    }
  }

  render() {
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns', 'margin-bottom-medium')}>
          <form onSubmit={e => e.preventDefault()} data-category="navigation">
            <div
              className={f(
                'secondary',
                'callout',
                'border',
                'margin-bottom-none',
              )}
            >
              <div className={f('row')}>
                <div className={f('large-12', 'columns', 'search-input')}>
                  <h3>
                    Search families, domains, proteins, keywords or GO terms
                  </h3>
                  <TextSearchBox inputRef={node => (this._input = node)} />
                </div>
              </div>

              <div className={f('row')}>
                <div className={f('medium-8', 'columns', 'search-ex')}>
                  <span>
                    {' '}
                    e.g.
                    <Example>IPR020422</Example>,
                    <Example>kinase</Example>,
                    <Example>O00167</Example>,
                    <Example>PF02932</Example>,
                    <Example>GO:0007165</Example>,
                    <Example>1t2v</Example>
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
                  <span>Powered by EBI search</span>
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
                  <button className={f('button')}>Search</button>
                  <Link
                    className={f('secondary', 'hollow', 'button')}
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

                <Settings />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps2 = createSelector(
  state => state.customLocation.description.main.key,
  main => ({ main }),
);

export default connect(mapStateToProps2)(SearchByText);
