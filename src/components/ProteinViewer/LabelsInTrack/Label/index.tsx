import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { getTextForLabel } from 'utils/text';

import { ExtendedFeature } from '../..';

type LabelProps = {
  entry: ExtendedFeature;
  label?: unknown;
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
          {type}
          {getTextForLabel(entry, label)}
        </>
      )}
    </>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: Record<string, unknown>) => ({ label: ui.labelContent })
);

export default connect(mapStateToProps)(Label);
