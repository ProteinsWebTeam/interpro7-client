import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';
import theme from 'styles/theme-interpro.css';

const fPlus = foundationPartial(s, fonts, theme);

class Exporter extends PureComponent {
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
          style={{ backgroundColor: config.colors.get(entryDB) }}
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
            borderColor: config.colors.get(entryDB),
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
