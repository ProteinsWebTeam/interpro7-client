// @flow
import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import protvistaCSS from '../../ProteinViewer/style.css';

const f = foundationPartial(protvistaCSS);

const LabelBy = (
  { labelContent, changeSettingsRaw } /*: {
    labelContent: {
      accession: boolean,
      name: boolean,
      short: boolean,
    },
    changeSettingsRaw:function } */,
) => {
  const updateLabel = (evt) => {
    const opt = evt.target.value;
    const next = {
      ...labelContent,
      [opt]: !labelContent[opt],
    };
    if (!next.accession && !next.name && !next.short) {
      next.accession = true;
    }
    changeSettingsRaw('ui', 'labelContent', next);
  };
  return (
    <li>
      Label by
      <ul className={f('nested-list')}>
        <li key={'accession'}>
          <label>
            <input
              type="checkbox"
              onChange={updateLabel}
              value={'accession'}
              checked={labelContent.accession}
            />{' '}
            Accession
          </label>
        </li>
        <li key={'name'}>
          <label>
            <input
              type="checkbox"
              onChange={updateLabel}
              value={'name'}
              checked={labelContent.name}
            />{' '}
            Name
          </label>
        </li>
        <li key={'shortname'}>
          <label>
            <input
              type="checkbox"
              onChange={updateLabel}
              value={'short'}
              checked={labelContent.short}
            />{' '}
            Short Name
          </label>
        </li>
      </ul>
    </li>
  );
};
LabelBy.propTypes = {
  labelContent: T.shape({
    accession: T.bool,
    name: T.bool,
    short: T.bool,
  }),
  changeSettingsRaw: T.func,
};

const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  (ui) => ({
    labelContent: ui.labelContent,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(LabelBy);
