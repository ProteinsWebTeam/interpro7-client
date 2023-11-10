import React from 'react';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const f = cssBinder(local);

type Props = {
  accession: string | number;
  withTitle?: boolean;
  title?: string;
};

const Accession = ({ withTitle, accession, title }: Props) => {
  return (
    <div>
      {title !== '' && withTitle ? <span> {title || 'Accession'}:</span> : null}
      {title === 'Job ID' ? (
        <span className={f('tag-sqc')}> {accession}</span>
      ) : (
        accession
      )}
    </div>
  );
};

export default Accession;
