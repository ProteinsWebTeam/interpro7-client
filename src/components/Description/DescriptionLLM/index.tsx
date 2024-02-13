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
};

const DescriptionLLM = ({ accession }: Props) => {
  if ((accession || '').length === 0) return null;

  return (
    <Callout type="warning">
      <div>
        The description below includes sections that have been automatically
        generated using an AI language model. Please exercise discretion when
        interpreting the information provided.
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          paddingTop: '0.4em',
        }}
      >
        <Link
          href={`${config.root.readthedocs.href}llm_descriptions.html`}
          target="_blank"
        >
          <span className={css('small', 'icon', 'icon-common', 'icon-book')} />{' '}
          Read more on description generation.
        </Link>

        {config.root?.LLMFeedback?.href ? (
          <Link
            href={`${config.root.LLMFeedback.href}${accession}`}
            target="_blank"
          >
            <span
              className={css('small', 'icon', 'icon-common', 'icon-pencil-alt')}
            />{' '}
            Provide feedback
          </Link>
        ) : null}
      </div>
    </Callout>
  );
};

export default DescriptionLLM;
