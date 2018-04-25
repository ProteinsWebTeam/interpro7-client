import React, { PureComponent, Children } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import ErrorBoundary from 'wrappers/ErrorBoundary';

import style from './style.css';

const f = foundationPartial(style);

const FilterPanel = ({ label, collapsed, toggle, children }) => (
  <div className={f('columns', 'small-12', 'medium-4', 'large-4', 'end')}>
    {label && (
      <button className={f('toggle')} onClick={toggle}>
        {collapsed ? '▸' : '▾'} {label}
      </button>
    )}
    <div className={f('filter-panel', { collapsed })}>{children}</div>
  </div>
);
FilterPanel.propTypes = {
  label: T.string,
  collapsed: T.bool,
  toggle: T.func,
  children: T.any,
};

class FiltersPanel extends PureComponent {
  static propTypes = {
    children: T.any,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
      description: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { filters: Children.map(props.children, () => false) };
  }

  toggleAll = () => {
    const toCollapse = Object.values(this.state.filters).reduce(
      (acc, v) => v && acc,
      true,
    );
    const children = Array.isArray(this.props.children)
      ? this.props.children
      : [this.props.children];
    this.setState({ filters: children.map(() => !toCollapse) });
  };

  clearAll = () => {
    const { description, hash, search } = this.props.customLocation;
    const { key } = description.main;
    let db = key === 'protein' ? 'UniProt' : description[key].db;
    if (key === 'organism') db = 'taxonomy';
    const newDescription = {
      ...description,
      [key]: {
        ...description[key],
        db,
      },
    };
    newDescription.entry.integration = null;
    this.props.goToCustomLocation({
      description: newDescription,
      search: { page_size: search.page_size },
      hash,
    });
  };

  toggleFilter = i => () => {
    const [...filters] = this.state.filters;
    filters[i] = !filters[i];
    this.setState({ filters });
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
        <div
          className={f(
            'columns',
            'large-12',
            'show-for-large',
            'margin-bottom-medium',
          )}
        >
          <span>Filter By</span>
          <span className={f('filter-buttons')}>
            <button className={f('but-collapse')} onClick={this.clearAll}>
              Clear
            </button>&nbsp;|&nbsp;
            <button className={f('but-collapse')} onClick={this.toggleAll}>
              {toCollapse ? 'Show All' : 'Collapse All'}
              <span className={f('filter-title-arrow')}>
                {toCollapse ? ' ▸' : ' ▾'}
              </span>
            </button>
          </span>
        </div>

        <ErrorBoundary>
          {children.map(
            (child, i) =>
              child && (
                <FilterPanel
                  key={i}
                  label={child.props.label}
                  toggle={this.toggleFilter(i)}
                  collapsed={this.state.filters[i]}
                >
                  {child}
                </FilterPanel>
              ),
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(FiltersPanel);
