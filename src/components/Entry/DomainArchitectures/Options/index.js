// @flow
import React from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeSettingsRaw } from 'actions/creators';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import ToggleSwitch from 'components/ToggleSwitch';

import { foundationPartial } from 'styles/foundation';
import local from './style.css';

const f = foundationPartial(local);

/*::
type PropsIDAOptions = {
  changeSettingsRaw: function,
  idaAccessionDB: string,
  idaLabel?: string,
}
*/
const IDAOptions = (
  { changeSettingsRaw, idaAccessionDB /*, idaLabel*/ } /*: PropsIDAOptions */,
) => {
  const toggleDomainEntry = () => {
    changeSettingsRaw(
      'ui',
      'idaAccessionDB',
      idaAccessionDB === 'pfam' ? 'interpro' : 'pfam',
    );
  };
  // TODO: Remove function and component if by July 2023  hasn't been required. It needs to be removed from redux too.
  // const toggleDomainLabel = () => {
  //   changeSettingsRaw(
  //     'ui',
  //     'idaLabel',
  //     idaLabel === 'name' ? 'accession' : 'name',
  //   );
  // };

  return (
    <nav className={f('options-panel')}>
      <div className={f('accession-selector-panel')}>
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
      {/* <div className={f('accession-selector-panel')}>
        <label>
          Label:{' '}
          <Tooltip title="Display labels as names or accessions">
            <ToggleSwitch
              switchCond={idaLabel === 'name'}
              name={'labelSwitch'}
              id={'labelSwitch-input'}
              SRLabel={'Choose content of labels'}
              onValue={'Name'}
              offValue={'Accession'}
              handleChange={toggleDomainLabel}
              addAccessionStyle={true}
            />
          </Tooltip>
        </label>
      </div> */}
    </nav>
  );
};
IDAOptions.propTypes = {
  changeSettingsRaw: T.func,
  idaAccessionDB: T.string,
  idaLabel: T.string,
};
const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  ({ idaAccessionDB, idaLabel }) => ({
    idaAccessionDB,
    idaLabel,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(IDAOptions);
