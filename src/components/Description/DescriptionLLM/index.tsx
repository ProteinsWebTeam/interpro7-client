import React, { PureComponent } from 'react';

import cssBinder from 'styles/cssBinder';
import globalStyles from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Link from 'components/generic/Link';

import Description from '..';
import config from 'config';

const css = cssBinder(globalStyles, fonts);

type Props = {
  text: string;
};

class DescriptionLLM extends PureComponent<Props> {
  render() {
    const text = this.props.text || '';
    if (text.length === 0) return null;

    return (
      <>
        <div className={css('row')}>
          <div className={css('columns', 'large-12')}>
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
                  'icon-exclamation-triangle'
                )}
              />{' '}
              <p>
                This description has been automatically generated using{' '}
                <Link href="https://openai.com/research/gpt-4" target="_blank">
                  GPT-4
                </Link>
                , an AI language model, and is based on data extracted from{' '}
                <Link href="https://www.uniprot.org" target="_blank">
                  UniProtKB/Swiss-Prot
                </Link>
                . It has not undergone a thorough review by curators. Please
                exercise discretion when interpreting the information provided
                and consider it as preliminary.
                <br />
                <Link
                  href={`${config.root.readthedocs.href}llm_description.html`}
                  target="_blank"
                >
                  Read more on description generation
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Description textBlocks={[text]} />
      </>
    );
  }
}

export default DescriptionLLM;
