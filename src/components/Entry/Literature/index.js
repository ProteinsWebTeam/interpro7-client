import React, {PropTypes as T} from 'react';

import styles from 'styles/blocks.css';
import refStyles from './style.css';
import {PMCLink, DOILink} from '../../ExtLink';

// import {buildAnchorLink} from '../../utils/url';

const Literature = ({references}) => (
  <div className={styles.card}>
    <h3>Literature</h3>
    <ul className={refStyles.list}>
      {Object.entries(references).map(([pubID, ref]) => (
        <li className={refStyles.reference} key={pubID} id={pubID}>
          <span className={refStyles.reference_id}>[{pubID}]</span>
          <span className={refStyles.authors}>{ref.authors}</span>
          <span className={refStyles.year}>({ref.year})</span>.
          <span className={refStyles.title}>{ref.title}</span>
          <span className={refStyles.journal}>{ref.ISOJournal}</span>,
          <span className={refStyles.issue}>{ref.issue}</span>,
          <span className={refStyles.pages}>{ref.rawPages}</span>.
          {ref.DOI_URL && <DOILink id={ref.DOI_URL}>DOI</DOILink>}
          {ref.DOI_URL && <span>|</span>}
          <PMCLink id={ref.PMID}>EuropePMC</PMCLink>
        </li>
      ))}
    </ul>
  </div>
);
Literature.propTypes = {
  references: T.objectOf(T.object.isRequired).isRequired,
};

export default Literature;
