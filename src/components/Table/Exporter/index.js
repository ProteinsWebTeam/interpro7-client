// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import Link from 'components/generic/Link';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import optionsCSS from 'components/ProteinViewer/Options/style.css';
import s from './style.css';
import theme from 'styles/theme-interpro.css';

const fPlus = foundationPartial(s, fonts, optionsCSS, theme);

/*:: type Props = {
  entryDB: string,
  children: any,
  includeSettings: boolean | function,
  backgroundColor?: string,
  disabled?: boolean,
} */

/*:: type State = {
  isOpen: boolean,
} */
class Exporter extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    entryDB: T.string,
    children: T.any,
    includeSettings: T.oneOfType([T.bool, T.func]),
    backgroundColor: T.string,
    disabled: T.bool,
  };

  render() {
    const {
      children,
      entryDB,
      includeSettings = true,
      backgroundColor,
      disabled = false,
    } = this.props;
    return (
      <div
        className={fPlus('button-group', 'small', 'exporter')}
        style={{ display: 'flex' }}
      >
        <DropDownButton
          label="Export"
          icon="&#x3d;"
          color={entryDB ? config.colors.get(entryDB) : backgroundColor}
          disabled={disabled}
          extraClasses={fPlus('right-aligned', 'protvista-menu')}
        >
          {children}
        </DropDownButton>
        {includeSettings && (
          <Tooltip title="Settings (customise results by page, …)">
            <div style={{ display: 'flex' }}>
              <Link
                to={{ description: { other: ['settings'] } }}
                className={fPlus(
                  'icon',
                  'icon-common',
                  'icon-settings',
                  'show-for-large',
                )}
                data-icon="&#xf013;"
                aria-label="settings"
              />
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.entry.db,
  (entryDB) => ({ entryDB }),
);

export default connect(mapStateToProps)(Exporter);
