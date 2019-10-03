import React, { useState } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import descriptionToDescription from 'utils/processDescription/descriptionToDescription';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import { goToCustomLocation } from 'actions/creators';

const f = foundationPartial(interproTheme, fonts, local, ipro);

const TITLE = 'Import Result';
const ImportResultSearch = ({ goToCustomLocation }) => {
  const [id, setId] = useState('');
  const [isValid, setValid] = useState(false);
  const handleImport = () => {
    goToCustomLocation({
      description: {
        main: { key: 'result' },
        result: {
          type: 'InterProScan',
          accession: id,
        },
      },
    });
  };
  const handleChange = event => {
    try {
      descriptionToDescription({
        main: { key: 'result' },
        result: {
          type: 'InterProScan',
          accession: event.target.value,
        },
      });
      setValid(true);
    } catch (error) {
      setValid(false);
    }
    setId(event.target.value);
  };
  const handleKeyPress = event => {
    const enterKey = 13;
    if (event.charCode === enterKey) {
      if (isValid) handleImport();
    }
  };

  return (
    <div className={f('import-result')}>
      <label htmlFor="interproScanId">Import:</label>
      <input
        name="interproScanId"
        type="text"
        placeholder="InterProScan ID"
        value={id}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        disabled={!isValid}
        className={f('button')}
        aria-label={TITLE}
        onClick={handleImport}
      >
        <span className={f('icon', 'icon-common')} data-icon="&#xf381;" />
      </button>
    </div>
  );
};
ImportResultSearch.propTypes = {
  goToCustomLocation: T.func,
};
export default connect(
  undefined,
  { goToCustomLocation },
)(ImportResultSearch);
