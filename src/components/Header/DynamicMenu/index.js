// @flow
import React, {PropTypes as T} from 'react';
import {withRouter, Link} from 'react-router/es';
import {connect} from 'react-redux';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';

import {InterPro, entities, singleEntity} from 'menuConfig';

const styles = foundationPartial(ebiStyles, interproStyles);

const InterProMenu = ({pathname}) => (
  <ul className={styles('menu')}>
    {InterPro.map(({to, name}) => (
      <li key={to}>
        <Link to={to} className={styles({active: pathname === to})}>
          {name}
        </Link>
      </li>
    ))}
  </ul>
);
InterProMenu.propTypes = {
  pathname: T.string.isRequired,
};

const SingleEntityMenu = ({data, type, pathname}) => {
  const [baseURL] = pathname.match(
    new RegExp(`^.*${data.metadata.accession}`, 'i')
  );
  return (
    <ul className={styles('menu')}>
      {singleEntity
        .filter(({to}) => !to.includes(type))
        .map(({to, name, counter}) => (
          <li key={to}>
            <Link to={baseURL + to} activeClassName={styles('active')}>
              {name}&nbsp;
              {counter &&
                <span className={styles('badge')}>
                  {data.metadata.counters[counter] || 0}
                </span>
              }
            </Link>
          </li>
        ))
      }
    </ul>
  );
};
SingleEntityMenu.propTypes = {
  data: T.object.isRequired,
  type: T.string.isRequired,
  pathname: T.string.isRequired,
};

const EntityMenu = () => (
  <ul className={styles('menu')}>
    {entities.map(({to, name}) => (
      <li key={to}>
        <Link to={to} activeClassName={styles('active')}>{name}</Link>
      </li>
    ))}
  </ul>
);

const DynamicMenu = ({data, location: {pathname}}) => {
  if (!data || pathname === '/') return <InterProMenu pathname={pathname} />;
  const type = pathname.match(/^\/?([^/]*)/)[1].toLowerCase();
  if (data.metadata) {
    return (
      <SingleEntityMenu data={data} type={type} pathname={pathname} />
    );
  }
  return <EntityMenu data={data} type={type} />;
};
DynamicMenu.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default withRouter(connect(({data: {data}}) => ({data}))(DynamicMenu));

