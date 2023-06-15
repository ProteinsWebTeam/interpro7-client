import React from 'react';

import Popup from '../src/components/ProteinViewer/Popup';
import Conservation from '../src/components/ProteinViewer/Popup/Conservation';
import Entry from '../src/components/ProteinViewer/Popup/Entry';
import Residue from '../src/components/ProteinViewer/Popup/Residue';
import { goToCustomLocation } from '../src/actions/creators';

export default {
  title: 'InterPro UI/Popups',
};

const conservationDetail = {
  feature: {
    a: { position: 1, value: 20 },
    b: { position: 2, value: 30 },
    c: { position: 3, value: 40 },
  },
  type: 'conservation',
};

const entryDetail = {
  feature: {
    accession: 'ACC',
    description: 'the desc',
    name: 'name',
    type: 'string',
    entry: 'ENTRY',
    protein: 'Protein',
    locations: [{ fragments: [{ start: 10, end: 20 }] }],
  },
  highlight: '10:20',
};
const target = document.createElement('div');
target.className = 'residue';

const residueDetail = {
  feature: {
    locations: [{ fragments: [{ start: 10, end: 10 }] }],
    accession: 'RES',
    currentResidue: {
      description: 'residue',
      residue: 'R',
      start: 10,
      end: 10,
    },
  },
  target,
};
const currentLocation = {
  main: { key: 'entry' },
  entry: { db: 'interpro', acc: 'YEBO' },
};

export const ConservationPopup = () => (
  <section>
    <h5>Conservation</h5>
    <div style={{ border: '1px solid grey' }}>
      <Conservation detail={conservationDetail} />
    </div>
    <hr />
    <h5>Conservation via Popup</h5>
    <div style={{ border: '1px solid grey' }}>
      <Popup
        detail={conservationDetail}
        goToCustomLocation={goToCustomLocation}
        sourceDatabase="DB"
        currentLocation={currentLocation}
      />
    </div>
  </section>
);

export const EntryPopup = () => (
  <section>
    <h5>Entry</h5>
    <div style={{ border: '1px solid grey' }}>
      <Entry
        detail={entryDetail}
        goToCustomLocation={goToCustomLocation}
        sourceDatabase="DB"
        currentLocation={currentLocation}
      />
    </div>
    <hr />
    <h5>Entry via Popup</h5>
    <div style={{ border: '1px solid grey' }}>
      <Popup
        detail={entryDetail}
        goToCustomLocation={goToCustomLocation}
        sourceDatabase="DB"
        currentLocation={currentLocation}
      />
    </div>
  </section>
);
export const ResiduePopup = () => {
  return (
    <section>
      <h5>Entry</h5>
      <div style={{ border: '1px solid grey' }}>
        <Residue detail={residueDetail} sourceDatabase="DB" />
      </div>
      <hr />
      <h5>Entry via Popup</h5>
      <div style={{ border: '1px solid grey' }}>
        <Popup
          detail={residueDetail}
          goToCustomLocation={goToCustomLocation}
          sourceDatabase="DB"
          currentLocation={currentLocation}
        />
      </div>
    </section>
  );
};
