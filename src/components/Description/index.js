/* @flow */
/* eslint no-magic-numbers: [1, {ignore: [2]}] */
import React, {PropTypes as T} from 'react';

import ReadMoreCard from 'components/ReadMoreCard';

import styles from 'styles/blocks.css';

import {transformFormatted} from 'utils/text';

const ParagraphWithCites = ({p}) => (
  <p>
    {p.split(/* /<cite id="([^"]+)" ?\/>/i *//\[(PUB\d+)\]/i).map((part, i) => (
      i % 2 ?
        <a key={i} href={`${location.pathname}#${part}`}>[{part}]</a> :
        <span key={i}>{part}</span>
    ))}
  </p>
);
ParagraphWithCites.propTypes = {
  p: T.string.isRequired,
};

const Description = ({textBlocks}/*: {textBlocks: Array<string>}*/) => (
    <div className={styles.content}>
      <h4>Description</h4>
      {textBlocks.map((b, i) => (
        <p key={i}>
          {transformFormatted(b).map((p, i) => (
            <ParagraphWithCites key={i} p={p} />
          ))}
        </p>
      ))}
    </div>
);

Description.propTypes = {
  textBlocks: T.array.isRequired,
};
export default Description;
