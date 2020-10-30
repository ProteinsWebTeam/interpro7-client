import React from 'react';
import Tabs from 'components/Tabs';

export default {
  title: 'Basic UI/Tab',
};

export const Basic = () => (
  <Tabs>
    <div title="Search by sequence">ASWEYRIOEHFKLD</div>
    <div title="Search by text">Hello there!</div>
    <div title="Search by Domain Architecture">IDA</div>
  </Tabs>
);
