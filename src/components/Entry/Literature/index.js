import React, {PropTypes as T} from 'react';
import {PMCLink, DOILink} from 'components/ExtLink';

import refStyles from './style.css';
import ebiStyles from 'styles/ebi-global.css';
import {foundationPartial} from 'styles/foundation';
const f = foundationPartial(refStyles, ebiStyles);
// TODO: check the "partial" binding.
// The partial binding is not cascading the styles,
// in this case is taking row from ebi.css but is not
// using the foundation that has been defined

// import {buildAnchorLink} from 'utils/url';

const Literature = ({references}) => (
  <div className={f('row')}><div className={f('large-12', 'columns')}>
    <ul className={f('list')}>
      {Object.entries(references).map(([pubID, ref], i) => (
        <li className={f('reference', 'small')} key={pubID} id={pubID}>
          <span className={f('index')}>[{i + 1}]</span>
          <span className={f('authors')}>{ref.authors}</span>
          <span className={f('year')}>({ref.year})</span>.
          <span className={f('title')}>{ref.title}</span>
          {ref.ISOJournal &&
           <span className={f('journal')}>{ref.ISOJournal}, </span>}
          {ref.issue && <span className={f('issue')}>{ref.issue}, </span>}
          {ref.rawPages && <span className={f('pages')}>{ref.rawPages}. </span>}
          <span className={f('reference_id')}>{pubID}.</span>
          {ref.DOI_URL && <DOILink id={ref.DOI_URL}>DOI</DOILink>}
          {ref.DOI_URL && <span>|</span>}
          <PMCLink id={ref.PMID}>EuropePMC</PMCLink>
        </li>
      ))}
    </ul>
  </div></div>
);
Literature.propTypes = {
  references: T.objectOf(T.object.isRequired).isRequired,
};

export default Literature;
