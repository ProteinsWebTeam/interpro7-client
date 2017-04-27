import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import loadWebComponent from 'utils/loadWebComponent';

import getFetch from 'higherOrder/loadData/getFetch';

const hierarchyContainsAccession = (node, accession) => {
  if (node.accession === accession) return true;
  if (node.children) {
    for (const child of node.children) {
      if (hierarchyContainsAccession(child, accession)) return true;
    }
  }
  return false;
};
let apiUrl = null;

// TODO: change this logic to use the state!!
const getHierarchyUrl = ({protocol, hostname, port, root}, accession) => (
  `${protocol}//${hostname}:${port}${root}/entry/interpro/${accession}`
);

const getHierarchy = (accs, hierarchies) => new Promise((resolve, reject) => {
  if (accs.size === 0) {
    resolve(hierarchies);
    return;
  }
  const accession = String(accs.values().next().value);
  const fetchF = getFetch({method: 'GET', responseType: 'json'});
  let found = false;
  hierarchies.forEach(h => {
    if (hierarchyContainsAccession(h, accession)) found = true;
  });
  accs.delete(accession);
  if (found){
    resolve(getHierarchy(accs, hierarchies));
  } else {
    fetchF(getHierarchyUrl(apiUrl, accession))
      .then(({payload: {metadata: {hierarchy}}}) => {
        if (hierarchy) hierarchies.push(hierarchy);
      })
      .then(() => getHierarchy(accs, hierarchies))
      .then(() => resolve(hierarchies))
      .catch(e => reject(e));
  }
});
const webComponents = [];

class ProteinEntryHierarchy extends Component {
  static propTypes = {
    entries: T.arrayOf(T.shape({
      accession: T.string.required,
      type: T.string.required,
    })),
    api: T.shape({
      protocol: T.string.required,
      hostname: T.string.required,
      port: T.string.required,
      root: T.string.required,
    }),
  };

  componentWillMount() {
    const interproComponents = import(
      /* webpackChunkName: "interpro-components" */'interpro-components'
    );
    webComponents.push(loadWebComponent(
      () => interproComponents.then(m => m.InterproHierarchy)
    ).as('interpro-hierarchy'));
    webComponents.push(loadWebComponent(
      () => interproComponents.then(m => m.InterproEntry)
    ).as('interpro-entry'));
    webComponents.push(loadWebComponent(
      interproComponents.then(m => m.InterproType),
    ).as('interpro-type'));
  }

  async componentDidMount() {
    await Promise.all(webComponents);
    const {entries, api} = this.props;
    const hierarchies = [];
    apiUrl = api;
    const accs = new Set(
      entries
        .filter(e => e.type.toLowerCase() === 'family')
        .map(e => e.accession)
    );
    if (accs.size === 0) return;
    getHierarchy(accs, hierarchies)
      .then(() => {
        (() => {
          Promise.all(webComponents)
            .then(() => this._hierarchy.hierarchy = hierarchies);
        })();
      })
      .catch(reason => console.log(reason.message));
  }

  render() {
    const {entries} = this.props;
    return (
      <interpro-hierarchy
        accessions={entries.map(e => e.accession)}
        hrefroot="/entry/interpro"
        ref={(node) => this._hierarchy = node}
        displaymode="pruned no-children"
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.api,
  api => ({api})
);

export default connect(mapStateToProps)(ProteinEntryHierarchy);
