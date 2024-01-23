import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Card from 'components/SimpleCommonComponents/Card';
import LazyImage from 'components/LazyImage';
import SpeciesIcon from 'components/Organism/SpeciesIcon';

import Provider from './Provider';
import configureStore from './configureStore';

import cssBinder from 'styles/cssBinder';

import toolsCSS from 'components/home/Tools/styles.css';

const css = cssBinder(toolsCSS);

const store = configureStore();

const meta = {
  title: 'Basic UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type CardStory = StoryObj<typeof meta>;

export const Base: CardStory = {
  args: {
    title: 'The Card',
    children: 'A message to show',
    footer: 'The footnote',
  },
};
export const TitleJSX: CardStory = {
  args: {
    title: (
      <>
        The <span style={{ color: 'red' }}>Title</span> can be <i>JSX</i>.
      </>
    ),
    children: 'A message to show',
    footer: 'The footnote',
  },
};
export const WithReadMore: CardStory = {
  args: {
    title: 'The Card',
    children: 'A message to show',
    linkForMore: '//www.google.com',
  },
};
export const WithImageIconClass: CardStory = {
  args: {
    title: 'The Card',
    children: 'A message to show',
    imageIconClass: css('image-tool-ipscan'),
  },
};

export const WithImage: CardStory = {
  args: {
    title: 'The Card',
    imageComponent: (
      <LazyImage
        src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=1cuk&file=traces.jpg`}
        alt={`structure with accession 1cuk`}
      />
    ),
    children: 'A message to show',
  },
};

export const WithSpeciesIcon: CardStory = {
  args: {
    title: 'The Card',
    imageComponent: (
      <SpeciesIcon
        lineage=" 1 131567 2 1783272 1239 91061 186826 186828 2747 2751 1234679 "
        fontSize="3rem"
      />
    ),
    children: 'A message to show',
  },
};
