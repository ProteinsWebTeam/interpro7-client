import React, {Component, PropTypes as T} from 'react';
import {findDOMNode} from 'react-dom';
import {Link} from 'react-router/es';

import domAttributeChecker from 'higherOrder/DOMAttributeChecker';
import cfg from 'config';

import styles from './style.css';

const parts = new Set(Object.keys(cfg.pages));

const fullPathToPartialPaths = fullPath => {
  const partialPaths = [{url: '/', name: 'Home'}];
  for (const name of fullPath.split('/').filter(x => x)) {
    partialPaths.push({
      url: `${partialPaths[partialPaths.length - 1].url}${name}/`,
      name,
    });
  }
  return partialPaths;
};

const getPaths = fullPath => {
  const pathGroups = [];
  let working = [];
  for (const path of fullPathToPartialPaths(fullPath)) {
    if (parts.has(path.name)) {
      pathGroups.push(working);
      working = [];
    }
    working.push(path);
  }
  pathGroups.push(working);
  const [[home], view, ...focus] = pathGroups;
  return {home, view, focus};
};

const positions = new WeakMap();

const mapPathArrayToLink = paths => paths.map(({url, name}, i) => (
  <Link key={url || i} to={url || '#'}>{name}</Link>
));

const formatEndpoints = (paths, expanded, {clientWidth, scrollWidth}) => {
  // console.log(clientWidth);
  // console.log(scrollWidth);
  const output = [
    {paths: [paths.home, {name: '…'}], type: 'home'},
    {paths: [...(paths.view || {}), {name: '…'}], type: 'view'},
    ...paths.focus.map(f => ({paths: [...f, {name: '…'}], type: 'focus'})),
  ];

  return output;
};

class Breadcrumb extends Component {
  static propTypes = {
    pathname: T.string.isRequired,
    refreshDOMAttributes: T.func.isRequired,
    scrollWidth: T.number,
    clientWidth: T.number,
  };

  state = {
    expanded: false,
    paths: {},
    nCompressed: 0,
  };

  componentWillMount = () => {
    this.setState({
      paths: getPaths(this.props.pathname),
    });
  }

  componentDidMount = () => {
    // window.node = findDOMNode(this);
    // this.handleUpdate();
  }

  componentWillReceiveProps = (nextProps) => {
    // console.log('will receive props', ...Object.values(nextProps));
    if (this.props.pathname !== nextProps.pathname) {
      this.setState({
        paths: getPaths(nextProps.pathname),
      });
    }
  }

  componentDidUpdate = () => {
    // this.handleUpdate();
    // FIXME: get new measurement some other way, or limit it.
    // this.props.refreshDOMAttributes();
  }

  handleUpdate = () => {
    const cont = findDOMNode(this);
    if (!cont.animate) return;
    const nodes = [...cont.parentElement.getElementsByClassName(styles.flip)];
    for (const node of nodes) {
      const curr = node.getBoundingClientRect();
      const prev = positions.get(node);
      if (prev) {
        console.log(
          `translate(${prev.left - curr.left}px, ${prev.top - curr.top}px)`
        );
        node.animate(
          [
            {transform: (
              `translate(${prev.left - curr.left}px, ${prev.top - curr.top}px)`
            )},
            {transform: 'translate(0, 0)'},
          ],
          {duration: 500, easing: 'ease-out'}
        );
      }
      positions.set(node, curr);
    }
  }

  expand = () => {
    this.setState({expanded: true});
  }

  reduce = () => {
    this.setState({expanded: false});
  }

  render() {
    const {expanded, paths} = this.state;
    const endpoints = formatEndpoints(paths, expanded, this.props);
    return (
      <nav
        style={{display: this.props.pathname === '/' ? 'none' : 'flex'}}
        className={styles[expanded ? 'expanded' : 'standard']}
        onFocus={this.expand} onBlur={this.reduce}
        onMouseEnter={this.expand} onMouseLeave={this.reduce}
      >
        <span className={styles.groups}>
          {endpoints.map((endpoint, i) => (
            <span key={i} className={i <= 1 ? styles.group : styles.focus}>
              {mapPathArrayToLink(endpoint.paths)}
            </span>
          ))}
        </span>
        <span className={styles.hint}>
          <Link to="/help" title="help">
            <div>main view</div>
            <div>focus</div>
          </Link>
        </span>
      </nav>
    );
  }
}

export default domAttributeChecker(
  'clientWidth', 'clientHeight', 'scrollWidth',
)(Breadcrumb);
// export default AdvancedBreadcrumb;
