import React from 'react';

import cssBinder from 'styles/cssBinder';
import globalStyles from 'styles/interpro-vf.css';
import localStyles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Link from 'components/generic/Link';

import config from 'config';

const css = cssBinder(globalStyles, localStyles, fonts);

type Props = {
  accession: string;
};

const DescriptionLLM = ({ accession }: Props) => {
  if ((accession || '').length === 0) return null;

  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <div
        className={css('callout', 'warning')}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '2em',
            color: '#664d03',
            paddingRight: '1rem',
          }}
          className={css(
            'small',
            'icon',
            'icon-common',
            'icon-exclamation-triangle',
          )}
        />{' '}
        <p>
          The description below includes sections that have been automatically generated
          using{' '}
          <Link href="https://openai.com/research/gpt-4" target="_blank">
            GPT-4
          </Link>
          , an AI language model, and is based on data extracted from{' '}
          <Link href="https://www.uniprot.org" target="_blank">
            UniProtKB/Swiss-Prot
          </Link>
          .{' '}
          Please exercise discretion when interpreting the information provided
          and consider it as preliminary.
          <br />
          <Link
            href={`${config.root.readthedocs.href}llm_descriptions.html`}
            target="_blank"
          >
            Read more on description generation.
          </Link>
          {config.root?.LLMFeedback?.href ? (
            <Link
              href={`${config.root.LLMFeedback.href}${accession}`}
              target="_blank"
              className={css(
                'vf-button',
                'vf-button--secondary',
                'vf-button--sm',
              )}
            >
              <span
                className={css(
                  'small',
                  'icon',
                  'icon-common',
                  'icon-pencil-alt',
                )}
              />{' '}
              Provide feedback
            </Link>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default DescriptionLLM;
