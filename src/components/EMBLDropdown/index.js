// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { closeEMBLMapNav } from 'actions/creators';
import { emblMapNavSelector } from 'reducers/ui/emblMapNav';

import { inert as inertPolyfill } from 'utils/polyfills';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const styleBundle = foundationPartial(styles, fonts, ebiGlobalStyles);

/*:: type Props = {
  visible?: boolean,
  closeEMBLMapNav: Function,
}; */

/*:: type State =  {|
  wasRendered: boolean,
|}; */

export class EMBLDropdown extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    visible: T.bool,
    closeEMBLMapNav: T.func.isRequired,
  };

  static getDerivedStateFromProps(
    { visible } /*: Props */,
    { wasRendered } /*: State */,
  ) {
    if (wasRendered || !visible) return null;
    return { wasRendered: true };
  }

  constructor(props /*: Props */) {
    super(props);

    this.state = { wasRendered: false };
  }

  componentDidMount() {
    inertPolyfill();
  }

  _handleClick = () => {
    this.props.closeEMBLMapNav();
  };

  render() {
    const { visible } = this.props;
    const { wasRendered } = this.state;
    let content = null;
    if (visible || wasRendered) {
      content = (
        <nav
          id="embl-dropdown"
          className={styleBundle('dropdown-pane', 'bottom', 'embl-dropdown')}
        >
          <div className={styleBundle('row', 'padding-bottom-medium')}>
            <div className={styleBundle('columns', 'padding-top-medium')}>
              <button
                className={styleBundle('close-button')}
                aria-label="Close alert"
                type="button"
                onClick={this._handleClick}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className={styleBundle('columns', 'medium-7')}>
              <div className={styleBundle('large-10', 'medium-12')}>
                <div
                  className={styleBundle(
                    'margin-bottom-large',
                    'padding-top-xsmall',
                    'margin-top-large',
                  )}
                >
                  <h3
                    className={styleBundle('no-underline', 'inline')}
                    style={{ lineHeight: '1rem' }}
                  >
                    <Link href="//embl.org">EMBL</Link>
                  </h3>{' '}
                  was set up in 1974 as Europe’s flagship laboratory for the
                  life sciences – an intergovernmental organisation with more
                  than 80 independent research groups covering the spectrum of
                  molecular biology:
                </div>
              </div>
              <div
                className={styleBundle(
                  'row',
                  'large-up-3',
                  'medium-up-3',
                  'small-up-2',
                  'no-underline',
                  'medium-11',
                )}
              >
                <div className={styleBundle('column', 'padding-bottom-medium')}>
                  <Link href="//www.embl.de/research/index.php">
                    <h5 className={styleBundle('inline', 'underline')}>
                      Research:
                    </h5>{' '}
                    perform basic research in molecular biology
                  </Link>
                </div>
                <div className={styleBundle('column', 'padding-bottom-medium')}>
                  <Link href="//www.embl.de/services/index.html">
                    <h5 className={styleBundle('inline', 'underline')}>
                      Services:
                    </h5>{' '}
                    offer vital services to scientists in the member states
                  </Link>
                </div>
                <div className={styleBundle('column', 'padding-bottom-medium')}>
                  <Link href="//www.embl.de/training/index.php">
                    <h5 className={styleBundle('inline', 'underline')}>
                      Training
                    </h5>{' '}
                    scientists, students and visitors at all levels
                  </Link>
                </div>
                <div className={styleBundle('column', 'padding-bottom-medium')}>
                  <Link href="//www.embl.de/research/tech_transfer/index.html">
                    <h5 className={styleBundle('inline', 'underline')}>
                      Transfer
                    </h5>{' '}
                    and development of technology
                  </Link>
                </div>
                <div className={styleBundle('column', 'padding-bottom-medium')}>
                  <h5 className={styleBundle('inline', 'underline')}>
                    Develop
                  </h5>{' '}
                  new instruments and methods
                </div>
                <div className={styleBundle('column', 'padding-bottom-medium')}>
                  <h5 className={styleBundle('inline', 'underline')}>
                    Integrating
                  </h5>{' '}
                  life science research in Europe
                </div>
              </div>
              <div className={styleBundle('margin-top-xlarge', 'no-underline')}>
                <h3>
                  <Link href="//embl.org" className={styleBundle('readmore')}>
                    More about EMBL
                  </Link>
                </h3>
              </div>
            </div>
            <div className={styleBundle('columns', 'medium-5')}>
              <div className={styleBundle('large-10', 'medium-12')}>
                <h3 className={styleBundle('inline')}>Six sites</h3>
                <p>represent EMBL in Europe.</p>
              </div>
              <div className={styleBundle('row medium-up-2', 'small-up-2')}>
                <div className={styleBundle('column')}>
                  <h5 className={styleBundle('inline')}>
                    <Link href="//www.embl-barcelona.es/">Barcelona</Link>
                  </h5>
                  <p>Tissue biology and disease modelling</p>
                </div>
                <div className={styleBundle('column')}>
                  <h5 className={styleBundle('inline')}>
                    <Link href="//www.embl.fr/">Grenoble</Link>
                  </h5>
                  <p>Structural biology</p>
                </div>
                <div className={styleBundle('column')}>
                  <h5 className={styleBundle('inline')}>
                    <Link href="//www.embl-hamburg.de/">Hamburg</Link>
                  </h5>
                  <p>Structural biology</p>
                </div>
                <div className={styleBundle('column')}>
                  <h5 className={styleBundle('inline')}>
                    <Link href="//www.embl.de/">Heidelberg</Link>
                  </h5>
                  <p>Main laboratory</p>
                </div>
                <div className={styleBundle('column')}>
                  <h5 className={styleBundle('inline')}>
                    <Link href="//www.ebi.ac.uk/">Hinxton</Link>
                  </h5>
                  <p className={styleBundle('margin-bottom-none')}>
                    EMBL-EBI: European Bioinformatics Institute
                  </p>
                </div>
                <div className={styleBundle('column')}>
                  <h5 className={styleBundle('inline')}>
                    <Link href="//www.embl.it/">Rome</Link>
                  </h5>
                  <p>Epigenetics and neurobiology</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
    }
    if (!(visible || wasRendered)) return null;
    return (
      <div
        inert={visible ? undefined : ''}
        aria-hidden={!visible}
        className={styleBundle('masthead-black-bar', { visible })}
      >
        {content}
      </div>
    );
  }
}

const mapStateToProps = createSelector(emblMapNavSelector, visible => ({
  visible,
}));

export default connect(
  mapStateToProps,
  { closeEMBLMapNav },
)(EMBLDropdown);
