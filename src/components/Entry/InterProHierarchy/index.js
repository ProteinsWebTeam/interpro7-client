import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/loadWebComponent';
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
    const h = this.props.hierarchy;
    if (h) this._ref.current.hierarchy = h;
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

export default connect(null, { goToCustomLocation })(InterProHierarchy);
