import React from 'react';

import { withKnobs, boolean } from '@storybook/addon-knobs';

import { Column } from 'components/Table';
import SimpleTable from 'components/Table/SimpleTable';

export default {
  title: 'InterPro UI/Table/Simple',
  decorators: [withKnobs],
};

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5 },
  { id: 3, name: 'Third', extra: 0.75 },
  { id: 4, name: 'Fourth', extra: 0.5 },
];
export const TheSimpleTable = () => (
  // The top:0 in the headerStyle is added to reset the sticky that compensates the InterPro header
  <SimpleTable dataTable={basicData}>
    <Column dataKey="id" headerStyle={{ top: 0 }}>
      ID
    </Column>
    <Column dataKey="name" headerStyle={{ top: 0 }}>
      Name
    </Column>
  </SimpleTable>
);
export const TheSimpleTableWithKnobs = () => (
  // The top:0 in the headerStyle is added to reset the sticky that compensates the InterPro header
  <SimpleTable
    dataTable={basicData}
    isStale={boolean('isStale', false)}
    loading={boolean('loading', false)}
    notFound={boolean('notFound', false)}
    ok={boolean('ok', true)}
  >
    <Column dataKey="id" headerStyle={{ top: 0 }}>
      ID
    </Column>
    <Column dataKey="name" headerStyle={{ top: 0 }}>
      Name
    </Column>
  </SimpleTable>
);
export const TheSimpleTableWithRenderers = () => (
  // The top:0 in the headerStyle is added to reset the sticky that compensates the InterPro header
  <SimpleTable dataTable={basicData}>
    <Column dataKey="id" headerStyle={{ top: 0 }}>
      ID
    </Column>
    <Column dataKey="name" headerStyle={{ top: 0 }}>
      Name
    </Column>
    <Column
      dataKey="extra"
      headerStyle={{ top: 0 }}
      displayIf={boolean('show percentage', true)}
      renderer={(extra) => <span>{extra * 100}%</span>}
    >
      Percentage
    </Column>
  </SimpleTable>
);
