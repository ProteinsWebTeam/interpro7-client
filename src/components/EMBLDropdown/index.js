// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
const styleBundle = foundationPartial(styles, fonts, ebiGlobalStyles);

export class EMBLDropdown extends PureComponent /*:: <{ visible: boolean }> */ {
  static propTypes = {
    visible: T.bool.isRequired,
  };

  render() {
    const { visible } = this.props;
    return (
      <div className={styleBundle('masthead-black-bar')}>
        <div
          id="embl-dropdown"
          className={styleBundle('dropdown-pane', 'bottom', 'embl-dropdown', {
            'is-open': visible,
          })}
        >
          <p>
            EMBL-EBI in Hinxton is one of six EMBL locations across Europe.
            <br />
            <a
              href="https://www.ebi.ac.uk/about"
              className={styleBundle('small', 'readmore')}
              rel="noopener"
            >
              More about EMBL-EBI
            </a>
          </p>
          <h6>Connect to another EMBL location</h6>
          <div
            className={styleBundle(
              'row',
              'small-collapse',
              'clearfix',
              'padding-bottom-large'
            )}
          >
            <div
              className={styleBundle(
                'columns',
                'small-5',
                'padding-bottom-medium'
              )}
            >
              <a href="https://www.embl.de/" rel="noopener">
                Heidelberg
              </a>
              <div className={styleBundle('small')}>Main Laboratory</div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-7',
                'padding-bottom-medium'
              )}
            >
              <a href="http://www.embl-barcelona.es/" rel="noopener">
                Barcelona
              </a>
              <div className={styleBundle('small')}>
                Tissue biology and disease modelling
              </div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-5',
                'padding-bottom-medium'
              )}
            >
              <a href="https://www.embl.fr/" rel="noopener">
                Grenoble
              </a>
              <div className={styleBundle('small')}>Structural Biology</div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-7',
                'padding-bottom-medium'
              )}
            >
              <a href="https://www.embl-hamburg.de/" rel="noopener">
                Hamburg
              </a>
              <div className={styleBundle('small')}>Structural Biology</div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-5',
                'padding-bottom-medium'
              )}
            >
              <a href="https://www.embl.it/" rel="noopener">
                Rome
              </a>
              <div className={styleBundle('small')}>
                Epigenetics and neurology
              </div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-7',
                'padding-bottom-medium'
              )}
            >
              <a
                href="http://embl.org/"
                rel="noopener"
                className={styleBundle('readmore')}
              >
                More about EMBL
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.emblMapNav,
  visible => ({ visible })
);

export default connect(mapStateToProps)(EMBLDropdown);
