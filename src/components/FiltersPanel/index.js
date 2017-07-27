import React, { Component } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

const FilterPanel = ({ label, collapsed, onCollapse, children }) =>
  <div className={f('columns')}>
    <h6 onClick={onCollapse} style={{ cursor: 'pointer' }}>
      {collapsed ? '▸' : '▾'} {label}
    </h6>
    <div className={f('filter-panel', { collapsed })}>
      {children}
    </div>
  </div>;
FilterPanel.propTypes = {
  label: T.string.isRequired,
  collapsed: T.bool,
  onCollapse: T.func,
  children: T.any,
};

class FiltersPanel extends Component {
  static propTypes = {
    children: T.any,
  };

  constructor() {
    super();
    this.state = { filters: [] };
  }

  componentWillMount() {
    const children = this.props.children.length
      ? this.props.children
      : [this.props.children];
    this.setState({ filters: children.map(() => false) });
  }

  toggleAll = () => {
    const toCollapse = Object.values(this.state.filters).reduce(
      (acc, v) => v && acc,
      true,
    );
    this.setState({ filters: this.props.children.map(() => !toCollapse) });
  };

  toggleFilter = i => {
    const state = this.state;
    state.filters[i] = !state.filters[i];
    this.setState(state);
  };

  render() {
    const children = this.props.children.length
      ? this.props.children
      : [this.props.children];
    const toCollapse = Object.values(this.state.filters).reduce(
      (acc, v) => v && acc,
      true,
    );
    return (
      <div className={f('row', 'filters-panel')}>
        <div className={f('shrink', 'columns')}>
          <h6>Filter By</h6>
          <button className={f('but-collapse')} onClick={this.toggleAll}>
            {toCollapse ? 'Show All' : 'Collapse All'}
            <span className={f('filter-title-arrow')}>
              {toCollapse ? ' ▸' : ' ▾'}
            </span>
          </button>
        </div>
        {children.map((child, i) =>
          <FilterPanel
            key={i}
            label={child.props.label}
            onCollapse={() => this.toggleFilter(i)}
            collapsed={this.state.filters[i]}
          >
            {child}
          </FilterPanel>,
        )}
      </div>
    );
  }
}

export default FiltersPanel;
