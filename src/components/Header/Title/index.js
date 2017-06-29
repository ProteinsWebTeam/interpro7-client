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
              <svg viewBox="0 0 76 76" id="interpro-logo" version="1.1">
                <path
                  className={styles('logo-color')}
                  d="m 1.8541681,33.36914 c -2.45708203,2.45708 -2.45570403,6.41352 0.0014,8.8706 l 14.6075559,14.60755 9.080524,-9.08052 -0.18783,-0.18782 c -2.35721,-2.35723 -2.35583,-6.15153 0.001,-8.50876 L 38.957576,25.46667 c 1.17861,-1.17861 2.71693,-1.76639 4.25507,-1.76639 1.53816,0 3.07647,0.58778 4.25507,1.76639 l 0.18783,0.18782 9.1841,-9.1841 -14.60756,-14.6075503 c -1.22854,-1.22855002 -2.83266,-1.84235002 -4.43599,-1.84235002 -1.6033,0 -3.20606,0.61517999 -4.43461,1.84373002 L 1.8541681,33.36914 Z M 18.754297,59.13849 33.361846,73.74604 c 2.45709,2.45709 6.41491,2.45709 8.87198,0 l 31.50493,-31.50492 c 2.45709,-2.45708 2.45709,-6.4149 0,-8.87198 l -14.60756,-14.60756 -9.18548,9.18549 0.18782,0.18782 c 2.35723,2.35721 2.35723,6.15016 0,8.50738 l -13.60213,13.60214 c -2.35722,2.35722 -6.15293,2.35723 -8.51014,0 l -0.18645,-0.18644 -9.080519,9.08052 z"
                />
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
    (data = {}) => Object.values(data).some(datum => datum.loading)
  ),
  state => state.ui.stuck,
  state => state.location.pathname,
  (loading, stuck, pathname) => ({ loading, stuck, pathname })
);

export default connect(mapStateToProps)(Title);
