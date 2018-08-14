import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/load-web-component';
import pathToDescription from 'utils/processDescription/pathToDescription';

import config from 'config';

const webComponents = [];

const loadInterProWebComponents = () => {
  if (!webComponents.length) {
    const interproComponents = () =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components');
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then(m => m.InterproHierarchy),
      ).as('interpro-hierarchy'),
    );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then(m => m.InterproEntry),
      ).as('interpro-entry'),
    );
    webComponents.push(
      loadWebComponent(() => interproComponents().then(m => m.InterproType)).as(
        'interpro-type',
      ),
    );
  }
  return Promise.all(webComponents);
};
const getUniqueHierarchies = hierarchies =>
  Array.from(new Map(hierarchies.map(h => [h.accession, h])).values());

class ProteinEntryHierarchy extends PureComponent {
  static propTypes = {
    entries: T.arrayOf(
      T.shape({
        accession: T.string.isRequired,
        type: T.string.isRequired,
        hierarchy: T.object.isRequired,
      }),
    ),
    api: T.shape({
      protocol: T.string.isRequired,
      hostname: T.string.isRequired,
      port: T.string.isRequired,
      root: T.string.isRequired,
    }),
    goToCustomLocation: T.func,
  };

  constructor(props) {
    super(props);
    this._ref = React.createRef();
  }

  async componentDidMount() {
    await loadInterProWebComponents();
    if (this._ref.current) {
      // Making sure the same hierarchy only appears once.
      this._ref.current.hierarchy = getUniqueHierarchies(
        this.props.entries.map(e => e.hierarchy),
      );
      // Adding the click event so it doesn't refresh the whole page,
      // but instead use the customLocation.
      this._ref.current.addEventListener('click', e => {
        const target = (e.path || e.composedPath())[0];
        if (target.classList.contains('link')) {
          e.preventDefault();
          this.props.goToCustomLocation({
            description: pathToDescription(
              target
                .getAttribute('href')
                .replace(new RegExp(`^${config.root.website.path}`), ''),
            ),
          });
        }
      });
    }
  }

  render() {
    const { entries } = this.props;
    return (
      <interpro-hierarchy
        accessions={entries.map(e => e.accession)}
        hrefroot={`${config.root.website.path}/entry/interpro`}
        ref={this._ref}
        displaymode="pruned no-children"
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.api,
  api => ({ api }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(ProteinEntryHierarchy);
