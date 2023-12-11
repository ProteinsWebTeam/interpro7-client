import React from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeSettingsRaw } from 'actions/creators';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import ToggleSwitch from 'components/ToggleSwitch';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

type PropsIDAOptions = {
  changeSettingsRaw: typeof changeSettingsRaw;
  idaAccessionDB: string;
};
const IDAOptions = ({ changeSettingsRaw, idaAccessionDB }: PropsIDAOptions) => {
  const toggleDomainEntry = () => {
    changeSettingsRaw(
      'ui',
      'idaAccessionDB',
      idaAccessionDB === 'pfam' ? 'interpro' : 'pfam',
    );
  };

  return (
    <nav className={css('options-panel')}>
      <div className={css('accession-selector-panel')}>
        <label>
          Database:{' '}
          <Tooltip title="Toogle between domain architectures based on Pfam and InterPro entries">
            <ToggleSwitch
              switchCond={idaAccessionDB === 'pfam'}
              name={'accessionDB'}
              id={'accessionDB-input'}
              SRLabel={'Use accessions from'}
              onValue={'Pfam'}
              offValue={'InterPro'}
              handleChange={toggleDomainEntry}
              addAccessionStyle={true}
            />
          </Tooltip>
        </label>
      </div>
    </nav>
  );
};
const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  ({ idaAccessionDB }) => ({
    idaAccessionDB,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(IDAOptions);
