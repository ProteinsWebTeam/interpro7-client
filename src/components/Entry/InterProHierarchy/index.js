import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/load-web-component';
import pathToDescription from 'utils/processDescription/pathToDescription';

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

const cleanHierarchyType = hierarchy => {
  const output = { ...hierarchy };
  output.type = output.type.replace('_', ' ');
  if (output.children && output.children.length) {
    output.children = output.children.map(cleanHierarchyType);
  }
  return output;
};

class InterProHierarchy extends PureComponent {
  static propTypes = {
    accession: T.string.isRequired,
    hierarchy: T.oneOfType([T.string, T.object]).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  async componentDidMount() {
    await loadInterProWebComponents();
    const hierarchy = this.props.hierarchy;
    if (hierarchy) this._ref.current.hierarchy = cleanHierarchyType(hierarchy);
    this._ref.current.addEventListener('click', e => {
      if (e.path[0].classList.contains('link')) {
        e.preventDefault();
        this.props.goToCustomLocation({
          description: pathToDescription(e.path[0].getAttribute('href')),
        });
      }
    });
  }

  render() {
    return (
      <interpro-hierarchy
        style={{ display: 'block', marginBottom: '1rem' }}
        accession={this.props.accession}
        hideafter="2"
        hrefroot="/entry/interpro"
        ref={this._ref}
      />
    );
  }
}

export default connect(
  null,
  { goToCustomLocation },
)(InterProHierarchy);
