import React, { PureComponent, Children } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import { UnconnectedErrorBoundary } from 'wrappers/ErrorBoundary';

import style from './style.css';

const f = foundationPartial(style);

export const FilterPanel = (
  {
    label,
    collapsed,
    toggle,
    children,
  } /*: {|
                         label: string,
                         collapsed: boolean,
                         toggle: function,
                         children: any,
                       |} */,
) => (
  <div
    className={f('columns', 'small-12', 'medium-4', 'large-4', 'end')}
    data-testid={`filterby-${label.toLowerCase().replace(/\s+/g, '_')}`}
  >
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

/*:: type Props = {|
  children: any,
  goToCustomLocation: function,
  customLocation: {
    search: {},
    description: {main: {}},
    hash: string
    }
|}; */

/*:: type State = {|
  filters: any
|}; */
export class FiltersPanel extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    children: T.any,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
      description: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
  };

  constructor(props /*: Props*/) {
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
    if (key === 'taxonomy') db = 'uniprot';
    const newDescription = {
      ...description,
      [key]: {
        ...description[key],
        db,
      },
    };
    newDescription.taxonomy.isFilter = false;
    newDescription.entry.integration = null;
    if (newDescription.protein.isFilter) newDescription.protein.db = 'uniprot';
    const newSearch = search.page_size ? { page_size: search.page_size } : {};
    this.props.goToCustomLocation({
      description: newDescription,
      search: newSearch,
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
          data-testid="filters-panel"
        >
          <span>Filter By</span>
          <span className={f('filter-buttons')}>
            <button className={f('but-collapse')} onClick={this.clearAll}>
              Clear
            </button>
            &nbsp;|&nbsp;
            <button className={f('but-collapse')} onClick={this.toggleAll}>
              {toCollapse ? 'Show All' : 'Collapse All'}
              <span className={f('filter-title-arrow')}>
                {toCollapse ? ' ▸' : ' ▾'}
              </span>
            </button>
          </span>
        </div>

        <UnconnectedErrorBoundary customLocation={this.props.customLocation}>
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
        </UnconnectedErrorBoundary>
      </div>
    );
  }
}
const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(FiltersPanel);
