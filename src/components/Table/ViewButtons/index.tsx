import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';
import styles from '../style.css';
const css = cssBinder(styles);

type Props = {
  tableIcon: boolean;
  card: boolean;
  withTree: boolean;
  withSunburst: boolean;
  withKeySpecies: boolean;
};
const TableViewButtons = ({
  tableIcon,
  card,
  withTree,
  withSunburst,
  withKeySpecies,
}: Props) => (
  <div className={css('type-selector', 'pp-table-options')}>
    {tableIcon && (
      <Tooltip title="View your results as a table">
        <Link
          to={(l) => ({ ...l, hash: 'table' })}
          className={css('icon-view', 'table-view')}
          activeClass={css('active')}
          aria-label="view your results as a table"
          data-testid="view-table-button"
        />
      </Tooltip>
    )}
    {card && (
      <div className={css('test-support-grid')}>
        <Tooltip title="View your results in a grid">
          <Link
            to={(l) => ({ ...l, hash: 'grid' })}
            className={css('icon-view', 'grid-view', {
              disabled: !card,
            })}
            activeClass={css('active')}
            aria-disabled={card ? 'false' : 'true'}
            aria-label="view your results in a grid"
            data-testid="view-grid-button"
          />
        </Tooltip>
      </div>
    )}
    {withTree && (
      <Tooltip title="View your results as a tree">
        <Link
          to={(l) => ({ ...l, hash: 'tree' })}
          className={css('icon-view', 'tree-view', {
            disabled: !withTree,
          })}
          activeClass={css('active')}
          aria-disabled={withTree ? 'false' : 'true'}
          aria-label="view your results as a tree"
          data-testid="view-tree-button"
        />
      </Tooltip>
    )}
    {withSunburst && (
      <Tooltip title="Display a sunburst view">
        <Link
          to={(l) => ({ ...l, hash: 'sunburst' })}
          className={css('icon-view', 'sunburst-view', {
            disabled: !withSunburst,
          })}
          activeClass={css('active')}
          aria-disabled={withSunburst ? 'false' : 'true'}
          aria-label="view your results as a sunburst"
          data-testid="view-sunburst-button"
        />
      </Tooltip>
    )}
    {withKeySpecies && (
      <Tooltip title="View only key species">
        <Link
          to={(l) => ({ ...l, hash: 'keyspecies' })}
          className={css('icon-view', 'keyspecies-view', {
            disabled: !withKeySpecies,
          })}
          activeClass={css('active')}
          aria-disabled={withKeySpecies ? 'false' : 'true'}
          aria-label="view only key species"
          data-testid="view-keyspecies-button"
        />
      </Tooltip>
    )}
  </div>
);

export default TableViewButtons;
