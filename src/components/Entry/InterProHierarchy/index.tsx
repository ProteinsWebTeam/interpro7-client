import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/load-web-component';
import pathToDescription from 'utils/processDescription/pathToDescription';

import config from 'config';

const webComponents: Promise<unknown>[] = [];

const loadInterProWebComponents = () => {
  if (!webComponents.length) {
    const interproComponents = () =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      );

    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then((m) => m.InterproHierarchy),
      ).as('interpro-hierarchy'),
    );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then((m) => m.InterproEntry),
      ).as('interpro-entry'),
    );
    webComponents.push(
      loadWebComponent(() =>
        interproComponents().then((m) => m.InterproType),
      ).as('interpro-type'),
    );
  }
  return Promise.all(webComponents);
};

const cleanHierarchyType = (hierarchy: InterProHierarchyType) => {
  const output = { ...hierarchy };
  output.type = output.type.replace('_', ' ');
  if (output.children && output.children.length) {
    output.children = output.children.map(cleanHierarchyType);
  }
  return output;
};

type Props = {
  accession: string;
  hierarchy: InterProHierarchyType;
  goToCustomLocation: typeof goToCustomLocation;
};

class InterProHierarchy extends PureComponent<Props> {
  _ref = React.createRef<HTMLElement & { hierarchy: InterProHierarchyType }>();

  async componentDidMount() {
    await loadInterProWebComponents();
    const hierarchy = this.props.hierarchy;
    if (hierarchy && this._ref.current)
      this._ref.current.hierarchy = cleanHierarchyType(hierarchy);
    this._ref.current?.addEventListener('click', (e) => {
      const target = e.composedPath()[0] as HTMLElement;
      if (target.classList.contains('link')) {
        e.preventDefault();
        this.props.goToCustomLocation({
          description: pathToDescription(
            (target?.getAttribute('href') || '')?.replace(
              new RegExp(`^${config.root.website.path}`),
              '',
            ),
          ),
        });
      }
    });
  }
  async componentDidUpdate() {
    await loadInterProWebComponents();
    const hierarchy = this.props.hierarchy;
    if (hierarchy && this._ref.current)
      this._ref.current.hierarchy = cleanHierarchyType(hierarchy);
  }

  render() {
    return (
      <interpro-hierarchy
        style={{ display: 'block', marginBottom: '1rem', marginLeft: '-4px' }}
        accession={this.props.accession}
        accessions={this.props.accession}
        hideafter={2}
        hrefroot={`${config.root.website.path}/entry/interpro`}
        ref={this._ref}
        displaymode="pruned"
      />
    );
  }
}

export default connect(null, { goToCustomLocation })(InterProHierarchy);
