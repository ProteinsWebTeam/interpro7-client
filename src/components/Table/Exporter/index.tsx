import React, { PropsWithChildren } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import Link from 'components/generic/Link';

import config from 'config';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import optionsCSS from 'components/ProteinViewer/Options/style.css';
import s from './style.css';
import ipro from 'styles/interpro-vf.css';
const css = cssBinder(s, ipro, fonts, optionsCSS);

type Props = PropsWithChildren<{
  entryDB: string | null;
  includeSettings?: boolean;
  backgroundColor?: string;
  disabled?: boolean;
}>;

const Exporter = ({
  children,
  entryDB,
  includeSettings = true,
  backgroundColor,
  disabled = false,
}: Props) => {
  return (
    <div
      className={css('button-group', 'small', 'exporter')}
      style={{ display: 'flex' }}
    >
      <DropDownButton
        label="Export"
        icon="&#x3d;"
        color={entryDB ? config.colors.get(entryDB) : backgroundColor}
        disabled={disabled}
        extraClasses={css('right-aligned', 'protvista-menu')}
      >
        {children}
      </DropDownButton>
      {includeSettings && (
        <Tooltip title="Settings">
          <div style={{ display: 'flex' }}>
            <Link
              to={{ description: { other: ['settings'] } }}
              className={css(
                'icon',
                'icon-common',
                'icon-settings',
                'show-for-large',
                'no-decoration',
              )}
              data-icon="&#xf013;"
              aria-label="settings"
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.entry.db,
  (entryDB) => ({ entryDB }),
);

export default connect(mapStateToProps)(Exporter);
