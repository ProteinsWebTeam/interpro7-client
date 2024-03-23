import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Popup from 'components/ProteinViewer/Popup';
import Conservation from 'components/ProteinViewer/Popup/Conservation';
import Entry from 'components/ProteinViewer/Popup/Entry';
import Residue from 'components/ProteinViewer/Popup/Residue';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import Provider from '../Provider';
import configureStore from '../configureStore';

const store = configureStore({ pathname: '/entry/interpro/ipr999999' });

export default {
  title: 'InterPro UI/Popups',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof Popup>;

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
const currentLocation: InterProLocation = {
  description: descriptionToDescription({
    main: { key: 'entry' },
    entry: { db: 'interpro', accession: 'ipr000001' },
  }) as unknown as InterProDescription,
  search: {},
  hash: '',
  state: {},
};

export const ConservationPopup = () => (
  <section>
    <h5>
      <Tooltip title={<Conservation detail={conservationDetail} />}>
        Conservation
      </Tooltip>
    </h5>
    <div style={{ border: '1px solid grey' }}>
      <Conservation detail={conservationDetail} />
    </div>
    <hr />
    <h5>
      <Tooltip
        title={
          <Popup
            detail={conservationDetail}
            sourceDatabase="DB"
            currentLocation={currentLocation}
          />
        }
      >
        Conservation via Popup
      </Tooltip>
    </h5>
    <div style={{ border: '1px solid grey' }}>
      <Popup
        detail={conservationDetail}
        sourceDatabase="DB"
        currentLocation={currentLocation}
      />
    </div>
  </section>
);

export const EntryPopup = () => (
  <section>
    <h5>
      <Tooltip
        title={
          <Entry
            detail={entryDetail}
            sourceDatabase="DB"
            currentLocation={currentLocation}
          />
        }
      >
        Entry
      </Tooltip>
    </h5>
    <div style={{ border: '1px solid grey' }}>
      <Entry
        detail={entryDetail}
        sourceDatabase="DB"
        currentLocation={currentLocation}
      />
    </div>
    <hr />
    <h5>
      <Tooltip
        title={
          <Popup
            detail={entryDetail}
            sourceDatabase="DB"
            currentLocation={currentLocation}
          />
        }
      >
        Entry via Popup
      </Tooltip>
    </h5>
    <div style={{ border: '1px solid grey' }}>
      <Popup
        detail={entryDetail}
        sourceDatabase="DB"
        currentLocation={currentLocation}
      />
    </div>
  </section>
);

export const ResiduePopup = () => {
  return (
    <section>
      <h5>
        <Tooltip title={<Residue detail={residueDetail} sourceDatabase="DB" />}>
          Residue
        </Tooltip>
      </h5>
      <div style={{ border: '1px solid grey' }}>
        <Residue detail={residueDetail} sourceDatabase="DB" />
      </div>
      <hr />
      <h5>
        <Tooltip
          title={
            <Popup
              detail={residueDetail}
              sourceDatabase="DB"
              currentLocation={currentLocation}
            />
          }
        >
          Residue via Popup
        </Tooltip>
      </h5>
      <div style={{ border: '1px solid grey' }}>
        <Popup
          detail={residueDetail}
          sourceDatabase="DB"
          currentLocation={currentLocation}
        />
      </div>
    </section>
  );
};
