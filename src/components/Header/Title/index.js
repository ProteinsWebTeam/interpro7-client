import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

import Link from 'components/generic/Link';
import logo from 'images/logo/interpro_white.png';

import {foundationPartial} from 'styles/foundation';
import ebiGlobalStyles from 'styles/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import localStyles from './style.css';
const styles = foundationPartial(ebiGlobalStyles, ipro, localStyles);

const Title = ({pathname, data = null, loading, stuck}) => {
  let subtitle = 'Classification of protein families';
  let small1;
  let small2;
  if (pathname !== '/' && data !== null) {
    if (data.metadata){
      subtitle = data.metadata.name.name;
      small1 = (data.metadata.source_database.toLowerCase() === 'interpro') ?
        null :
        data.metadata.source_database;
      small2 = data.metadata.accession;
    }
  }

  return (
    <div
      className={styles('columns', 'small-6', 'medium-8', 'anim')}
      id="local-title"
    >
      <h1 className={styles('main-title', {stuck})}>
        <Link to="/" title="Back to InterPro homepage">
          <img
            src={logo}
            alt="InterPro logo"
            className={styles('main-logo', {stuck, loading})}
          />
          InterPro
        </Link>
        {small1 && <span> {small1}</span>}
      </h1>
      <h4 className={styles('hide-for-small-only', 'subtitle', {stuck})}>
        {subtitle}
        {small2 && <small> ({small2})</small>}
      </h4>
    </div>
  );
};
Title.propTypes = {
  pathname: T.string.isRequired,
  data: T.object,
  loading: T.bool.isRequired,
  stuck: T.bool.isRequired,
};

export default connect(
  ({data = {}, ui: {stuck}, location: {pathname}}) => ({
    loading: Object.values(data).some(datum => datum.loading),
    stuck,
    pathname,
  })
)(Title);
