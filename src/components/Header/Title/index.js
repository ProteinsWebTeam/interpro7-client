import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import localStyles from './style.css';

const styles = foundationPartial(ebiGlobalStyles, ipro, localStyles);

const Title = ({ loading, mainDB, mainAccession, stuck }) => {
  const subtitle =
    mainAccession || mainDB || 'Classification of protein families';

  return (
    <div
      className={styles('columns', 'small-6', 'medium-8', 'anim')}
      id="local-title"
    >
      <h1 className={styles('main-title', { stuck })}>
        <Link newTo={{ description: {} }} title="Back to InterPro homepage">
          <div className={styles('logo-text')}>
            <div className={styles('logo-flex-item', 'main-logo', { stuck })}>
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
            <div className={styles('logo-flex-item')}>InterPro</div>
          </div>
        </Link>
      </h1>
      <h4 className={styles('hide-for-small-only', 'subtitle', { stuck })}>
        {subtitle}
        {mainDB &&
          mainDB !== subtitle &&
          <small>
            {' '}({mainDB})
          </small>}
      </h4>
    </div>
  );
};
Title.propTypes = {
  loading: T.bool.isRequired,
  mainDB: T.string,
  mainAccession: T.string,
  stuck: T.bool.isRequired,
};

const mapStateToProps = createSelector(
  createSelector(
    state => state.data,
    (data = {}) => Object.values(data).some(datum => datum.loading),
  ),
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainAccession,
  state => state.ui.stuck,
  (loading, mainDB, mainAccession, stuck) => ({
    loading,
    mainDB,
    mainAccession,
    stuck,
  }),
);
export default connect(mapStateToProps)(Title);
