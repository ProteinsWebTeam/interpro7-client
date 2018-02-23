import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/loadWebComponent';
import pathToDescription from 'utils/processDescription/pathToDescription';

const webComponents = [];

class InterProHierarchy extends PureComponent {
  static propTypes = {
    accession: T.string.isRequired,
    hierarchy: T.oneOfType([T.string, T.object]).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  componentWillMount() {
    if (webComponents.length) return;
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

  async componentDidMount() {
    await Promise.all(webComponents);
    const h = this.props.hierarchy;
    if (h) this._hierarchy.hierarchy = h;
    this._hierarchy.addEventListener('click', e => {
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
        ref={node => (this._hierarchy = node)}
      />
    );
  }
}

export default connect(null, { goToCustomLocation })(InterProHierarchy);
