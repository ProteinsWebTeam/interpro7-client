// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Accession } from '.';

const renderer = new ShallowRenderer();

describe('<Accession />', () => {
  test('should render the accession component for UniProt reviewed', () => {
    renderer.render(
      <Accession db="reviewed" accession="A0A023GPI8" id="LECA_CANBL" />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    renderer.render(<Accession db="reviewed" accession="A0A023GPI8" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render the accession component for UniProt unreviewed', () => {
    renderer.render(
      <Accession
        db="unreviewed"
        accession="A0A1S2IFJ5"
        id="A0A1S2IFJ5_9MICO"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    renderer.render(<Accession db="unreviewed" accession="A0A1S2IFJ5" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render the accession component for UniProt proteome', () => {
    renderer.render(<Accession db="proteome" accession="UP000000278" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render the accession component for taxon', () => {
    renderer.render(<Accession db="taxonomy" accession={1} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render the accession component for other', () => {
    renderer.render(
      <Accession
        db="sequence"
        accession="iprscan5-R20171012-151028-0135-99171282-p1m"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
