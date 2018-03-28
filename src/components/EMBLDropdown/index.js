// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { emblMapNavSelector } from 'reducers/ui/emblMapNav';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';

const styleBundle = foundationPartial(styles, fonts, ebiGlobalStyles);

/*:: type Props = {
  visible?: boolean,
}; */

/*:: type State =  {|
  wasRendered: boolean,
|}; */

export class EMBLDropdown extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    visible: T.bool,
  };

  constructor(props /*: Props */) {
    super(props);
    this.state = { wasRendered: !!props.visible };
  }

  componentWillReceiveProps({ visible } /*: Props */) {
    if (this.state.wasRendered) return;
    if (visible) this.setState({ wasRendered: true });
  }

  render() {
    const { visible } = this.props;
    const { wasRendered } = this.state;
    if (!(visible || wasRendered)) return null;
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
            <Link
              href="https://www.ebi.ac.uk/about"
              className={styleBundle('small', 'readmore')}
            >
              More about EMBL-EBI
            </Link>
          </p>
          <h6>Connect to another EMBL location</h6>
          <div
            className={styleBundle(
              'row',
              'small-collapse',
              'clearfix',
              'padding-bottom-large',
            )}
          >
            <div
              className={styleBundle(
                'columns',
                'small-5',
                'padding-bottom-medium',
              )}
            >
              <Link href="https://www.embl.de/">Heidelberg</Link>
              <div className={styleBundle('small')}>Main Laboratory</div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-7',
                'padding-bottom-medium',
              )}
            >
              <Link href="http://www.embl-barcelona.es/">Barcelona</Link>
              <div className={styleBundle('small')}>
                Tissue biology and disease modelling
              </div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-5',
                'padding-bottom-medium',
              )}
            >
              <Link href="https://www.embl.fr/">Grenoble</Link>
              <div className={styleBundle('small')}>Structural Biology</div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-7',
                'padding-bottom-medium',
              )}
            >
              <Link href="https://www.embl-hamburg.de/">Hamburg</Link>
              <div className={styleBundle('small')}>Structural Biology</div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-5',
                'padding-bottom-medium',
              )}
            >
              <Link href="https://www.embl.it/">Rome</Link>
              <div className={styleBundle('small')}>
                Epigenetics and neurology
              </div>
            </div>
            <div
              className={styleBundle(
                'columns',
                'small-7',
                'padding-bottom-medium',
              )}
            >
              <Link
                href="https://embl.org/"
                className={styleBundle('readmore')}
              >
                More about EMBL
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(emblMapNavSelector, visible => ({
  visible,
}));

export default connect(mapStateToProps)(EMBLDropdown);
