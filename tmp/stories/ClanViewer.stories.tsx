import React, { useEffect, useRef } from 'react';

import ClanViewer from 'clanviewer';

export default {
  title: 'InterPro UI/ClanViewer',
};

const data = {
  nodes: [
    {
      accession: 'PF01414',
      type: 'entry',
      score: 0.0047650203381921835,
    },
    {
      accession: 'PF00053',
      type: 'entry',
      score: 0.16394560928354787,
    },
    {
      accession: 'PF00008',
      type: 'entry',
      score: 0.2177023421888155,
    },
    {
      accession: 'PF12662',
      type: 'entry',
      score: 0.024661959972814784,
    },
    {
      accession: 'PF07974',
      type: 'entry',
      score: 0.01996794579187081,
    },
    {
      accession: 'PF07645',
      type: 'entry',
      score: 0.22717912824726372,
    },
    {
      accession: 'PF18720',
      type: 'entry',
      score: 0.01951401357231977,
    },
    {
      accession: 'PF12661',
      type: 'entry',
      score: 0.04621993650020795,
    },
  ],
  links: [
    {
      source: 'PF00008',
      target: 'PF07974',
      score: 8.4e-6,
    },
    {
      source: 'PF00008',
      target: 'PF07645',
      score: 0.00013,
    },
    {
      source: 'PF00008',
      target: 'PF18720',
      score: 0.00017,
    },
    {
      source: 'PF00008',
      target: 'PF12661',
      score: 4.2e-9,
    },
    {
      source: 'PF00008',
      target: 'PF12662',
      score: 0.0034,
    },
    {
      source: 'PF07974',
      target: 'PF18720',
      score: 2.5e-7,
    },
    {
      source: 'PF07974',
      target: 'PF12661',
      score: 0.0012,
    },
    {
      source: 'PF07645',
      target: 'PF12661',
      score: 3.6e-5,
    },
    {
      source: 'PF07645',
      target: 'PF12662',
      score: 0.00096,
    },
    {
      source: 'PF12661',
      target: 'PF12662',
      score: 0.0051,
    },
  ],
};

export const Basic = () => {
  const sampleRef = useRef(null);
  useEffect(() => {
    if (!sampleRef.current) return;
    const _vis = new ClanViewer({ element: sampleRef.current });
    _vis.paint(data);
  }, [sampleRef]);
  return <div ref={sampleRef} style={{ minHeight: 500 }} />;
};
