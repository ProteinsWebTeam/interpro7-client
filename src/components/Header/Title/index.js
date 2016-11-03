import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router/es';
import logo from 'images/logo/interpro_white.png';

import {foundationPartial} from 'styles/foundation';
import ebiGlobalStyles from 'styles/ebi-global.css';
import ipro from 'styles/interpro-new.css';
const style = foundationPartial(ebiGlobalStyles, ipro);

const Title = ({location, data}) => {
  let subtitle = 'Classification of protein families',
    small1 = null,
    small2 = null;
  if (location !== '/' && data !== null){
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
      className={style('columns', 'small-8', 'medium-10', 'anim')}
      id="local-title"
    >
      <h1>
        <Link to="/" title="Back to InterPro homepage">
          <img src={logo} alt="InterPro logo" />
          InterPro
        </Link>
        {small1 && <span> {small1}</span>}
      </h1>
      <h4 className={style('hide-for-small-only')}>
        {subtitle}
        {small2 && <small> ({small2})</small>}
      </h4>
    </div>
  );
};
Title.propTypes = {
  location: T.string.isRequired,
  data: T.object,
};

export default connect(({data: data}) => data)(Title);
