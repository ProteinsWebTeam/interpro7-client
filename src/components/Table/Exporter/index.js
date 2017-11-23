import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Tooltip } from 'react-tippy';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';
import theme from 'styles/theme-interpro.css';

const fPlus = foundationPartial(s, fonts, theme);

const colors = {
  gene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#2cd6d6' /* 00e2e2*/,
  mobidblt: '#d6dc94',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#fbbddd',
  prints: '#54c75f',
  prodom: '#8d99e4',
  profile: '#f69f74',
  prosite: '#f3c766',
  sfld: '#00b1d3',
  smart: '#ff8d8d',
  ssf: '#686868',
  tigrfams: '#56b9a6',
  InterPro: '#2daec1',
};

const getcolor = (mainDB, focusDB) => {
  let color = colors[mainDB];
  if (!color) {
    color = colors[focusDB];
  }
  return color;
};

class Exporter extends Component {
  static propTypes = {
    mainDB: T.string.isRequired,
    focusDB: T.string,
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    const { children, mainDB, focusDB } = this.props;
    return (
      <div className={fPlus('button-group', 'small', 'exporter')}>
        <button
          className={fPlus('button', 'dropdown')}
          style={{ backgroundColor: getcolor(mainDB, focusDB) }}
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <span className={fPlus('icon', 'icon-functional')} data-icon="=" />{' '}
          <span className={fPlus('hide-for-small-only')}>Export</span>{' '}
        </button>
        <Tooltip title="Settings (customise number of results by page ...)">
          <Link
            newTo={{ description: { other: 'settings' } }}
            className={fPlus(
              'icon',
              'icon-functional',
              'icon-settings',
              'show-for-large',
            )}
            data-icon="s"
            aria-label="settings"
          />
        </Tooltip>
        <div
          className={fPlus(
            'dropdown-pane',
            'left',
            'dropdown-content',
            focusDB,
          )}
          style={{
            borderColor: getcolor(mainDB, focusDB),
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
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.focusDB,
  (mainDB, focusDB) => ({ mainDB, focusDB }),
);
export default connect(mapStateToProps)(Exporter);
