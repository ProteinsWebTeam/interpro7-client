// @flow
import React from 'react';
import T from 'prop-types';

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

const Description = ({textBlocks}/*: {|textBlocks: Array<string>|} */) => (
  <ReadMoreCard>
    <div className={styles.content}>
      <h3>Description</h3>
      <ol>
        {textBlocks.map((b, i) => (
          <li key={i}>
            {transformFormatted(b).map((p, i) => (
              <ParagraphWithCites key={i} p={p} />
            ))}
          </li>
        ))}
      </ol>
    </div>
  </ReadMoreCard>
);

Description.propTypes = {
  textBlocks: T.array.isRequired,
};
export default Description;
