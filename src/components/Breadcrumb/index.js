import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import cfg from 'config';
import { sticky as supportsSticky } from 'utils/support';

import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

const parts = new Set(Object.keys(cfg.pages));

const fullPathToPartialPaths = fullPath => {
  const partialPaths = [{ url: '/', name: 'Home' }];
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
  return { home, view, focus };
};

const positions = new WeakMap();

const mapPathArrayToLink = paths =>
  paths.map(
    ({ url, name }, i) =>
      null && (
        <Link key={url || i} to={url || '#'}>
          {name}
        </Link>
      )
  );

const formatEndpoints = paths => [
  { paths: [paths.home, { name: '…' }], type: 'home' },
  { paths: [...(paths.view || {}), { name: '…' }], type: 'view' },
  ...paths.focus.map(f => ({ paths: [...f, { name: '…' }], type: 'focus' })),
];

class Breadcrumb extends Component {
  static propTypes = {
    description: T.object.isRequired,
    stuck: T.bool.isRequired,
    stickyMenuOffset: T.number.isRequired,
    // refreshDOMAttributes: T.func.isRequired,
    // scrollWidth: T.number,
    // clientWidth: T.number,
  };

  state = {
    expanded: false,
    paths: {},
    nCompressed: 0,
  };

  componentWillMount() {
    this.setState({
      paths: getPaths(''),
    });
  }

  componentDidMount() {
    // this.handleUpdate();
  }

  componentWillReceiveProps(nextProps) {
    // console.log('will receive props', ...Object.values(nextProps));
    if (this.props.description !== nextProps.description) {
      this.setState({
        paths: getPaths(''),
      });
    }
  }

  componentDidUpdate() {
    // this.handleUpdate();
    // FIXME: get new measurement some other way, or limit it.
    // this.props.refreshDOMAttributes();
  }

  handleUpdate = () => {
    if (!this._node || !this._node.animate) return;
    const nodes = [
      ...this._node.parentElement.getElementsByClassName(f('flip')),
    ];
    for (const node of nodes) {
      const curr = node.getBoundingClientRect();
      const prev = positions.get(node);
      if (prev) {
        console.log(
          `translate(${prev.left - curr.left}px, ${prev.top - curr.top}px)`
        );
        node.animate(
          [
            {
              transform: `translate(${prev.left - curr.left}px, ${prev.top -
                curr.top}px)`,
            },
            { transform: 'translate(0, 0)' },
          ],
          { duration: 500, easing: 'ease-out' }
        );
      }
      positions.set(node, curr);
    }
  };

  expand = () => {
    this.setState({ expanded: true });
  };

  reduce = () => {
    this.setState({ expanded: false });
  };

  render() {
    const { expanded, paths } = this.state;
    const endpoints = formatEndpoints(paths, expanded, this.props);
    const { stickyMenuOffset: offset, stuck } = this.props;
    const MAGIC = 88;
    return (
      <div
        className={f('row')}
        style={{
          flexShrink: 0,
          marginTop: supportsSticky && stuck ? `${offset + MAGIC}px` : '0',
        }}
        ref={node => (this._node = node)}
      >
        <div className={f('columns', 'large-12')} style={{ width: '100%' }}>
          <nav
            style={{ display: this.props.description.mainType ? '' : 'none' }}
            className={f('breadcrumbs', { expanded, standard: !expanded })}
            onFocus={this.expand}
            onBlur={this.reduce}
            onMouseEnter={this.expand}
            onMouseLeave={this.reduce}
          >
            <span className={f('groups')}>
              {endpoints.map((endpoint, i) => (
                <span key={i} className={f({ group: i <= 1, focus: i > 1 })}>
                  {mapPathArrayToLink(endpoint.paths)}
                </span>
              ))}
            </span>
            <span className={f('hint')}>
              <Link newTo={{ description: { other: 'help' } }} title="help">
                <div>main view</div>
                <div>focus</div>
              </Link>
            </span>
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  state => state.newLocation.description,
  (stuck, description) => ({ stuck, description })
);

export default connect(mapStateToProps)(Breadcrumb);
