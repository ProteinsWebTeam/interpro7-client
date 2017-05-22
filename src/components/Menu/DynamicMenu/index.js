// @flow
import React from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';

import InterproMenu from 'components/Menu/InterproMenu';
import EntitiesMenu from 'components/Menu/EntitiesMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';


import {memberDB} from 'staticData/home';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import localStyles from './style.css';

const styles = foundationPartial(ebiStyles, interproStyles, localStyles);

const accessions = [
  ...memberDB,
  // InterPro
  'IPR[0-9]{6}',
  // UniProt
  '[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}',
  // PDB
  '[0-9A-Z]{4}',
];
const dbAccs = new RegExp(
  `^(${accessions.map(db => db.accession).filter(db => db).join('|')})$`,
  'i',
);

const accessionChildRoutes = new Set([
  {path: dbAccs, component: SingleEntityMenu},
]);
const EntitiesMenuContainer = ({match, ...props}) => (
  <Switch
    {...props}
    base={match}
    childRoutes={accessionChildRoutes}
    indexRoute={EntitiesMenu}
    catchAll={EntitiesMenuContainer}
  />
);
EntitiesMenuContainer.propTypes = {
  match: T.string.isRequired,
};

const menuStyles = styles('menu', 'dynamic-menu');
const typeChildRoutes = new Set([
  {path: /entry|protein|structure/, component: EntitiesMenuContainer},
]);
export default (props/*: Object */) => (
  <Switch
    {...props}
    className={menuStyles}
    indexRoute={InterproMenu}
    childRoutes={typeChildRoutes}
    catchAll={InterproMenu}
  />
);
