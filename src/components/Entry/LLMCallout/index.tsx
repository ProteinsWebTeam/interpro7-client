import React from 'react';

import cssBinder from 'styles/cssBinder';
import globalStyles from 'styles/interpro-vf.css';
import localStyles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Link from 'components/generic/Link';
import Callout from 'components/SimpleCommonComponents/Callout';

import config from 'config';

const css = cssBinder(globalStyles, localStyles, fonts);

type Props = {
  accession: string;
  db: string;
};

const LLMCallout = ({ accession, db }: Props) => {
  if ((accession || '').length === 0) return null;

  return (
    <Callout type="warning">
      <div>
        This entry contains information that has been generated using an AI
        language model. Please exercise discretion when interpreting the
        information provided.
      </div>
      <div
        style={{
          display: 'flex',
          gap: '2em',
          paddingTop: '0.4em',
        }}
      >
        <Link
          href={`${config.root.readthedocs.href}llm_descriptions.html`}
          target="_blank"
        >
          <span className={css('small', 'icon', 'icon-common', 'icon-book')} />{' '}
          Read more on description generation
        </Link>

        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: {
                db: db,
                accession: accession,
                detail: 'feedback',
              },
            },
            search: {
              llm: 'llm',
            },
          }}
        >
          <span
            className={css('small', 'icon', 'icon-common', 'icon-pencil-alt')}
          />{' '}
          Provide feedback
        </Link>
      </div>
    </Callout>
  );
};

export default LLMCallout;
