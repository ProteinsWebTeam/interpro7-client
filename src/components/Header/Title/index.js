import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'styles/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import localStyles from './style.css';
const styles = foundationPartial(ebiGlobalStyles, ipro, localStyles);

const Title = ({ data = null, loading, stuck }) => {
  let subtitle = 'Classification of protein families';
  let small1;
  let small2;
  if (data !== null) {
    if (data.metadata) {
      subtitle = data.metadata.name.name;
      small1 =
        data.metadata.source_database.toLowerCase() === 'interpro'
          ? null
          : data.metadata.source_database;
      small2 = data.metadata.accession;
    }
  }

  return (
    <div
      className={styles('columns', 'small-6', 'medium-8', 'anim')}
      id="local-title"
    >
      <h1 className={styles('main-title', { stuck })}>
        <Link newTo={{ description: {} }} title="Back to InterPro homepage">
          <div className={styles('logo-text')}>
            <div className={styles('logo-flex-item')}>
              <svg class="icon" viewBox="0 0 88 88" width="62">
                <mask id="logo-mask">
                  <rect
                    x="10"
                    y="-65"
                    ry="8"
                    fill="white"
                    width="65"
                    height="65"
                  />
                  <rect x="10" y="-34" height="4" width="65" fill="black" />
                  <rect
                    x="23"
                    y="-41"
                    ry="8"
                    height="18"
                    width="38"
                    fill="black"
                  />
                </mask>
                <g transform="rotate(-45 136 4)">
                  <rect
                    x="10"
                    y="-65"
                    ry="8"
                    fill="white"
                    className={styles('logo-color')}
                    width="65"
                    height="65"
                    mask="url(#logo-mask)"
                  />
                </g>
              </svg>
            </div>
            <div className={styles('logo-flex-item')}>InterPro</div>
          </div>
        </Link>
        {small1 &&
          <span>
            {' '}{small1}
          </span>}
      </h1>
      <h4 className={styles('hide-for-small-only', 'subtitle', { stuck })}>
        {subtitle}
        {small2 &&
          <small>
            {' '}({small2})
          </small>}
      </h4>
    </div>
  );
};
Title.propTypes = {
  data: T.object,
  loading: T.bool.isRequired,
  stuck: T.bool.isRequired,
};

const mapStateToProps = createSelector(
  createSelector(
    state => state.data,
    (data = {}) => Object.values(data).some(datum => datum.loading),
  ),
  state => state.ui.stuck,
  state => state.location.pathname,
  (loading, stuck, pathname) => ({ loading, stuck, pathname }),
);

export default connect(mapStateToProps)(Title);
