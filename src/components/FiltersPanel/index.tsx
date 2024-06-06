import React, {
  PureComponent,
  Children,
  PropsWithChildren,
  ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { UnconnectedErrorBoundary } from 'wrappers/ErrorBoundary';
import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import style from './style.css';

const css = cssBinder(style);

export const getPayloadOrEmpty = <T = unknown,>(
  payload: T | null,
  loading: boolean,
  isStale?: boolean,
) => {
  let _payload: T | Record<string, number> = payload || {};
  if (payload && loading && !isStale) _payload = {};
  if (!payload) _payload = {};
  return _payload;
};

type FilterPanelProps = PropsWithChildren<{
  label: string;
  collapsed?: boolean;
  toggle?: () => void;
}>;
export const FilterPanel = ({
  label,
  collapsed,
  toggle,
  children,
}: FilterPanelProps) => (
  <div
    className={css('filter-container')}
    data-testid={`filterby-${label.toLowerCase().replace(/\s+/g, '_')}`}
  >
    {label && (
      <button className={css('toggle')} onClick={toggle}>
        <span className={css('arrow', { collapsed })}>▸</span>
        <span className={css('button-label')}>{label}</span>
      </button>
    )}
    <div className={css('filter-panel', { collapsed })}>{children}</div>
  </div>
);

type Props = PropsWithChildren<{
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
}>;

type State = {
  filters: Array<boolean>;
};
export class FiltersPanel extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { filters: Children.map(props.children, () => false) || [] };
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
    if (!this.props.customLocation) return;
    const { description, hash, search } = this.props.customLocation;
    const { key } = description.main;
    let db =
      key === 'protein' ? 'UniProt' : (description[key] as EndpointLocation).db;
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
    this.props.goToCustomLocation?.({
      description: newDescription,
      search: newSearch,
      hash,
    });
  };

  toggleFilter = (i: number) => () => {
    const [...filters] = this.state.filters;
    filters[i] = !filters[i];
    this.setState({ filters });
  };

  render() {
    const toCollapse = Object.values(this.state.filters).reduce(
      (acc, v) => v && acc,
      true,
    );
    return (
      <div className={css('filters-panel')}>
        <header>Filter By</header>
        {Children.count(this.props.children) > 1 && (
          <nav data-testid="filters-panel">
            <span className={css('filter-buttons')}>
              <button className={css('but-collapse')} onClick={this.clearAll}>
                Clear
              </button>
              &nbsp;|&nbsp;
              <button className={css('but-collapse')} onClick={this.toggleAll}>
                {toCollapse ? 'Show All' : 'Collapse All'}
                <span className={css('filter-title-arrow')}>
                  {toCollapse ? ' ▸' : ' ▾'}
                </span>
              </button>
            </span>
          </nav>
        )}
        <UnconnectedErrorBoundary customLocation={this.props.customLocation}>
          {Children.map(
            this.props.children,
            (child, i) =>
              child && (
                <FilterPanel
                  key={i}
                  label={(child as ReactElement).props.label}
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
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(FiltersPanel);
