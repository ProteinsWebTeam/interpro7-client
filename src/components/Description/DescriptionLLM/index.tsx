import React, { PureComponent } from 'react';

import cssBinder from 'styles/cssBinder';
import globalStyles from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Link from 'components/generic/Link';

import Description from '..';

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
                <strong>Unreviewed Protein Family Description</strong>
                <br />
                This description has been automatically generated using{' '}
                <Link
                  href="https://openai.com/research/gpt-4"
                  className={css('ext')}
                  target="_blank"
                >
                  GPT-4
                </Link>
                , an AI language model, and has not undergone a thorough review
                by curators.
                <br />
                Please exercise discretion when interpreting the information
                provided and consider it as preliminary.
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
