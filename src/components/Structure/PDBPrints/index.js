/* globals angular: false */
import React, {PropTypes as T, Component} from 'react';

const dependencies = [
  {
    element: 'link',
    attributes: {
      rel: 'stylesheet',
      href: '//www.ebi.ac.uk/pdbe/pdb-component-library/v1.0/css/pdb.component.library.min-1.0.0.css',
    },
  }, {
    element: 'script',
    attributes: {
      src: '//code.jquery.com/jquery-3.1.0.min.js',
    },
  }, {
    element: 'script',
    attributes: {
      src: '//www.ebi.ac.uk/pdbe/pdb-component-library/libs/d3.min.js',
    },
  }, {
    element: 'script',
    attributes: {
      src: '//www.ebi.ac.uk/pdbe/pdb-component-library/libs/angular.1.4.7.min.js',
    },
  }, {
    element: 'script',
    attributes: {
      src: '//www.ebi.ac.uk/pdbe/pdb-component-library/v1.0/js/pdb.component.library.min-1.0.0.js',
    },
  }
];
const prepareDependency = dependency => {
  const el = document.createElement(dependency.element);
  for (const [key, value] of Object.entries(dependency.attributes)) {
    el.setAttribute(key, value);
  }
  return el;
};
const prepareDependencies = dependencies => dependencies.map(prepareDependency);
const loadDependencies = (head, elements) => {
  const fragment = document.createDocumentFragment();
  for (const element of elements) {
    fragment.appendChild(element);
  }
  head.appendChild(fragment);
  return Promise.all(elements.map(element => new Promise((res, rej) => {
    element.addEventListener('load', res, {once: true});
    element.addEventListener('error', rej, {once: true});
  })));
};

// export default class PDBPrints extends Component {
//   static propTypes = {
//     accession: T.string.isRequired,
//   };
//
//   state = {ready: false};
//
//   async componentWillMount() {
//     if (!self.document) return;
//     this.head = document.head;
//     this.dependencies = prepareDependencies(dependencies);
//     try {
//       await loadDependencies(this.head, this.dependencies);
//       // angular.element(document).ready(() => {
//       //   angular.bootstrap(document.body, ['pdb.component.library']);
//       // });
//     } catch (error) {
//       console.error('unable to load all dependencies');
//       console.error(error);
//       return;
//     }
//     this.setState({ready: true});
//   }
//
//   componentWillUnmount() {
//     if (!self.document) return;
//     for (const el of this.dependencies) {
//       document.head.removeChild(el);
//     }
//     this.dependencies = null;
//   }
//
//   render() {
//     const {accession} = this.props;
//     const {ready} = this.state;
//     if (ready) {
//       return (
//         <pdb-prints
//           pdb-ids={`['${accession.toLowerCase()}']`}
//           settings={'{"size": 48}'}
//         />
//       );
//     }
//     return null;
//   }
// }

const PDBPrints = ({accession}) => (
  <div
    className="pdb-prints"
    pdb-ids={`['${accession.toLowerCase()}']`}
    settings={'{"size": 48}'}
  />
);
PDBPrints.propTypes = {
  accession: T.string.isRequired,
};

export default PDBPrints;
