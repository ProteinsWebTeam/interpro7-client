import React from 'react';

import { Column } from 'components/Table';
import SimpleTable from 'components/Table/SimpleTable';

export default {
  title: 'InterPro UI/Table',
};

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5 },
  { id: 3, name: 'Third', extra: 0.75 },
  { id: 4, name: 'Fourth', extra: 1 },
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
