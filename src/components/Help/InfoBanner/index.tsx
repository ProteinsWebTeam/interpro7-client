import React from 'react';
import Card from 'components/SimpleCommonComponents/Card';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import cards from 'components/SimpleCommonComponents/Card/styles.css';
import tools from 'components/home/Tools/styles.css';

const css = cssBinder(style, cards, tools);

const infoTopics = {
  InterProScan: {
    text: 'InterProScan is a sequence analysis application (nucleotide and protein sequences) that combines different protein signature recognition methods into one resource.',
    image: 'image-tool-ipscan',
  },
  IDA: {
    text: 'The InterPro Domain Architecture (IDA) tool allows you to search the InterPro database with a particular set of domains, and returns all of the domain architectures and associated proteins that match the query.',
    image: 'image-tool-ida',
  },
  TextSearch: {
    text: 'InterPro text search is powered by the EBI Search, a scalable text search engine that provides easy and uniform access to the biological data resources hosted at the European Bioinformatics Institute (EMBL-EBI).',
    image: 'image-tool-textsearch',
  },
  default: {
    text: '',
    image: '',
  },
};

type Props = {
  topic?: keyof typeof infoTopics;
};
export const InfoBanner = ({ topic = 'default' }: Props) => {
  const current = infoTopics[topic];
  return (
    <Card
      className={css('help-banner')}
      imageIconClass={css(current.image)}
      imageComponent={
        <div className={css('card-tag', 'tag-tool')}>{topic}</div>
      }
    >
      <div className={css('description')}>{current.text}</div>
    </Card>
  );
};

export default React.memo(InfoBanner);
