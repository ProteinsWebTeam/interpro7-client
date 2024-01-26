import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import style from './style.css';
import cards from 'components/SimpleCommonComponents/Card/styles.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(style, ipro, cards);

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
  default: {},
};

export const InfoBanner = ({ topic } /*: {topic: string} */) => {
  const current = infoTopics[topic] || infoTopics.default;
  return (
    <div className={f('help-banner', 'flex-card')}>
      <div className={f('card-image', current.image)}>
        <div className={f('card-tag', 'tag-tool')}>{topic}</div>
      </div>
      <div className={f('card-content')}>
        <div className={f('card-description')}>{current.text}</div>
      </div>
    </div>
  );
};
InfoBanner.propTypes = {
  topic: T.string,
};

export default React.memo(InfoBanner);
