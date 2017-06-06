import React, {Component} from 'react';
import T from 'prop-types';

import f from 'styles/foundation';

const FilterPanel = ({label, collapsed, onCollapse, children}) => (
  <div className={f('columns')}>
    <h6>
      <button onClick={onCollapse}>
        {collapsed ? '▸' : '▾'} {label}
      </button>
    </h6>
    <div style={{
      height: collapsed ? 0 : '100%',
      transform: collapsed ? 'scaleY(0)' : 'scaleY(1)',
      transformOrigin: '0 top',
      overflowY: collapsed ? 'hidden' : 'scroll',
      paddingLeft: '3px',
      transitionDuration: '0.5s',
      transitionProperty: 'transform',
    }}
    >
      {children}
    </div>
  </div>
);
FilterPanel.propTypes = {
  label: T.string.isRequired,
  collapsed: T.boolean,
  onCollapse: T.func,
  children: T.any,
};

class FiltersPanel extends Component {
  static propTypes = {
    children: T.any,
  }
  constructor(){
    super();
    this.state = {filters: []};

  }
  componentWillMount(){
    this.setState({filters: this.props.children.map(() => true)});
  }
  collapseAll = () => {
    this.setState({filters: this.props.children.map(() => true)});
  }
  toggleFilter = (i) => {
    const state = this.state;
    state.filters[i] = !state.filters[i];
    this.setState(state);
  }
  render() {
    return (
      <div className={f('row')} style={{maxHeight: '200px', marginBottom: '30px'}}>
        <div className={f('shrink', 'columns')}>
          <h5>Filter By</h5>
          <button onClick={this.collapseAll}>Collapse All ▾</button>
        </div>
        {this.props.children.map((child, i) => (
          <FilterPanel
            key={i}
            label={child.props.label}
            onCollapse={() => this.toggleFilter(i)}
            collapsed={this.state.filters[i]}
          >
            {child}
          </FilterPanel>
        ))}
      </div>
    );
  }
}
export default FiltersPanel;
