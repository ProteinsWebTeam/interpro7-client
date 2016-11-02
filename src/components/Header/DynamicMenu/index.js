import React, {PropTypes as T} from 'react';
import {withRouter, Link} from 'react-router/es';
import {connect} from 'react-redux';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';

const styles = foundationPartial(ebiStyles, interproStyles);

export const menuEntries = {
  home: [
    {to: '/', name: 'Home', icon: 'H', className: 'icon-generic'},
    {to: '/search/', name: 'Search', icon: '1', className: 'icon-functional'},
    {to: '/browse/', name: 'Browse', icon: 'b', className: 'icon-functional'},
    {to: '/release_notes/', name: 'Release Notes', icon: '0',
      className: 'icon-functional'},
    {to: '/download/', name: 'Download', icon: '=', className: 'icon-functional'},
    {to: '/help/', name: 'Help', icon: '?', className: 'icon-generic'},
    {to: '/about/', name: 'About', icon: 'i', className: 'icon-generic'},
    {to: '/settings/', name: 'Settings', icon: 's', className: 'icon-functional'},
  ],
  entities: [
    {to: '/entry/interpro/', name: 'Entry'},
    {to: '/protein/uniprot/', name: 'Protein'},
    {to: '/structure/pdb/', name: 'Structure'},
    {to: '/proteome/', name: 'Proteome'},
    {to: '/pathway/', name: 'Pathway'},
  ],
  singleEntity: [
    {to: '/', name: 'overview'},
    {to: '/entry/', name: 'entries', counter: 'entries'},
    {to: '/protein/', name: 'proteins', counter: 'proteins'},
    {to: '/structure/', name: 'structures', counter: 'structures'},
    {to: '/species/', name: 'species', counter: 'species'},
    {to: '/domain_architecture/', name: 'domain architectures'},
    {to: '/hmm_models/', name: 'HMM models'},
  ],
};

const HomeMenu = () => (
  <ul className={styles('menu')}>
    {menuEntries.home.map(({to, name}) => (
      <li key={to}>
        <Link to={to} activeClassName={styles('active')}>{name}</Link>
      </li>
    ))}
  </ul>
);

const SingleEntityMenu = ({data, type, pathname}) => {
  const [baseURL] = pathname.match(
    new RegExp(`^.*${data.metadata.accession}`, 'i')
  );
  return (
    <ul className={styles('menu')}>
      {menuEntries.singleEntity
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
    {menuEntries.entities.map(({to, name}) => (
      <li key={to}>
        <Link to={to} activeClassName={styles('active')}>{name}</Link>
      </li>
    ))}
  </ul>
);
// EntityMenu.propTypes = {
//   data: T.object.isRequired,
//   type: T.string.isRequired,
// };

const DynamicMenu = ({data, location: {pathname}}) => {
  if (!data || pathname === '/') return <HomeMenu />;
  const type = pathname.match(/^\/([^/]*)/)[1].toLowerCase();
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

