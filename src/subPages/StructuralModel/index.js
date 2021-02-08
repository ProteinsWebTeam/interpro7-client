import React, { useState, useEffect } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import AlignmentViewer from '../EntryAlignments/Viewer';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const StructuralModel = ({ data }) => {
  if (!data || data.loading || !data.payload) return null;
  return (
    <div className={f('row', 'column')}>
      <h3>Predicted Model</h3>

      <h3>SEED alignment</h3>
      <p>
        The model above was predicted by estimating the likelyhood of contacts
        between the residues in the alignment of the Pfam entry, The
        visualization below shows the contacts with higher probability.
      </p>
      <AlignmentViewer
        setColorMap={() => null}
        onConservationProgress={() => null}
        type="alignment:seed"
        colorscheme="clustal2"
        contacts={data.payload}
        contactThreshold={0.99}
      />
    </div>
  );
};

const mapStateToPropsForContacts = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const newDescription = {
      main: { key: 'entry' },
      entry: {
        db: description.entry.db || 'pfam',
        accession: description.entry.accession,
      },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDescription),
      query: { 'model:contacts': null },
    });
  },
);

export default loadData({
  getUrl: mapStateToPropsForContacts,
})(StructuralModel);
