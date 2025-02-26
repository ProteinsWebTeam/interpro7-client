import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { getTextForLabel } from 'utils/text';

import { ExtendedFeature } from '../../utils';

type LabelProps = {
  entry: ExtendedFeature;
  label?: LabelUISettings;
};
const Label = ({ entry, label }: LabelProps) => {
  const type =
    entry.source_database === 'interpro' && entry.type ? (
      <interpro-type type={entry.type.replace('_', ' ')} dimension="1em" />
    ) : null;
  return (
    <>
      {entry.accession.startsWith('residue:') ? (
        entry.accession.split('residue:')[1]
      ) : (
        <>
          {entry.accession.includes(':nMatch') &&
            !entry.accession.includes('IPR') &&
            '✨'}
          {type}
          {getTextForLabel(entry, label)}
        </>
      )}
    </>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: UISettings) => ({ label: ui.labelContent }),
);

export default connect(mapStateToProps)(Label);
