// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { overallDataLoadingSelector } from 'reducers/data-progress';
import { stuckSelector } from 'reducers/ui/stuck';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import localStyles from './style.css';

const styles = foundationPartial(ebiGlobalStyles, ipro, localStyles);

/*:: type Props = {
  loading: boolean,
  mainType: ?string,
  mainDB: ?string,
  mainAccession: ?string,
  stuck: boolean,
}; */

export class Title extends PureComponent /*:: <Props> */ {
  static propTypes = {
    loading: T.bool.isRequired,
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    stuck: T.bool.isRequired,
  };

  render() {
    const { loading, mainType, mainDB, mainAccession, stuck } = this.props;
    return (
      <div
        className={styles('columns', 'small-6', 'medium-8')}
        id="local-title"
      >
        <h1 className={styles('main-title', { stuck })}>
          <div className={styles('logo-flex')}>
            <Link to={{ description: {} }} title="Back to InterPro homepage">
              <div className={styles('logo-flex-item', 'logo-icon', { stuck })}>
                <svg className={styles('icon')} viewBox="0 0 88 88" width="62">
                  <defs>
                    <mask id="logo-mask">
                      <rect
                        x="10"
                        y="10"
                        ry="8"
                        width="65"
                        height="65"
                        fill="white"
                      />
                      <rect x="10" y="41" height="4" width="65" fill="black" />
                      <rect
                        x="23"
                        y="34"
                        ry="8"
                        height="18"
                        width="38"
                        fill="black"
                        className={styles('domain', { loading })}
                      />
                    </mask>
                  </defs>
                  <g transform="rotate(-45 45 41)">
                    <rect
                      x="10"
                      y="10"
                      ry="8"
                      width="65"
                      height="65"
                      fill="white"
                      mask="url(#logo-mask)"
                    />
                  </g>
                </svg>
              </div>

              <div className={styles('logo-flex-item', 'logo-text')}>
                InterPro
                {mainType === 'entry' &&
                  mainDB !== 'InterPro' &&
                  mainAccession && <span>&nbsp;- Member</span>}
              </div>
            </Link>
          </div>
        </h1>
        <h4 className={styles('subtitle', { stuck })}>
          Classification of protein families
        </h4>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  overallDataLoadingSelector,
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  stuckSelector,
  (loading, mainType, mainDB, mainAccession, stuck) => ({
    loading,
    mainType,
    mainDB,
    mainAccession,
    stuck,
  }),
);

export default connect(mapStateToProps)(Title);
