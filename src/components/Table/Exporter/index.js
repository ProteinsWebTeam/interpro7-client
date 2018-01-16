// @flow
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';
import theme from 'styles/theme-interpro.css';

const fPlus = foundationPartial(s, fonts, theme);

const colors = new Map([
  ['gene3d', '#a88cc3'],
  ['cdd', '#addc58'],
  ['hamap', '#2cd6d6'] /* 00e2e2*/,
  ['mobidblt', '#d6dc94'],
  ['panther', '#bfac92'],
  ['pfam', '#6287b1'],
  ['pirsf', '#fbbddd'],
  ['prints', '#54c75f'],
  ['prodom', '#8d99e4'],
  ['profile', '#f69f74'],
  ['prosite', '#f3c766'],
  ['sfld', '#00b1d3'],
  ['smart', '#ff8d8d'],
  ['ssf', '#686868'],
  ['tigrfams', '#56b9a6'],
  ['InterPro', '#2daec1'],
]);

class Exporter extends Component {
  static propTypes = {
    entryDB: T.string,
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    const { children, entryDB } = this.props;
    return (
      <div
        className={fPlus('button-group', 'small', 'exporter')}
        style={{ display: 'flex' }}
      >
        <button
          className={fPlus('button', 'dropdown')}
          style={{ backgroundColor: colors.get(entryDB) }}
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <span className={fPlus('icon', 'icon-functional')} data-icon="=" />{' '}
          <span className={fPlus('hide-for-small-only')}>Export</span>{' '}
        </button>
        <Tooltip title="Settings (customise  results by page ...)">
          <div style={{ display: 'flex' }}>
            <Link
              to={{ description: { other: ['settings'] } }}
              className={fPlus(
                'icon',
                'icon-functional',
                'icon-settings',
                'show-for-large',
              )}
              data-icon="s"
              aria-label="settings"
            />
          </div>
        </Tooltip>
        <div
          className={fPlus(
            'dropdown-pane',
            'left',
            'dropdown-content',
            entryDB,
          )}
          style={{
            borderColor: colors.get(entryDB),
            transform: `scaleY(${this.state.isOpen ? 1 : 0})`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.entry.db,
  entryDB => ({ entryDB }),
);

export default connect(mapStateToProps)(Exporter);
