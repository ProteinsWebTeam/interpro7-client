/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';

import { transformFormatted } from 'utils/text';

import Paragraph from './Paragraph';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Tooltip from '../SimpleCommonComponents/Tooltip';

const css = cssBinder(styles, fonts);

export const getDescriptionText = (
  description: string | StructuredDescription,
) => (typeof description === 'string' ? description : description.text);

export const hasLLMParagraphs = (
  description: Array<string | StructuredDescription>,
): boolean => {
  if (description.length === 0) return false;
  if (typeof description[0] === 'string') return false;
  const llmDescrpitions = description.filter(
    (desc) => (desc as StructuredDescription).llm,
  );
  return llmDescrpitions.length > 0;
};
type Props = {
  textBlocks: Array<string | StructuredDescription>;
  literature?: Array<[string, Reference]>;
  accession?: string;
  withoutIDs?: boolean;
};
class Description extends PureComponent<Props> {
  render() {
    const { textBlocks, literature, withoutIDs } = this.props;
    const sections = textBlocks.map((e) => {
      return (transformFormatted(getDescriptionText(e)) as string[]).map(
        (text) => ({
          text,
          llm: typeof e === 'string' ? false : e.llm,
          checked: typeof e === 'string' ? false : e.checked,
        }),
      );
    });

    return (
      <div className={css('description')} data-testid="description">
        {sections
          .map((section, i) =>
            section
              .map(({ text, llm, checked }, j) => (
                <div className={css('content', { llm, checked })} key={`${i}_${j}`}>
                  {llm ? (
                    <span className={css('vf-badge', 'vf-badge--tertiary')}>
                      AI-generated
                      <span className={css('details')}>{checked ? 'Reviewed' : 'Unreviewed'}</span>
                    </span>
                  ) : (
                    <span className={css('vf-badge', 'vf-badge--tertiary')}>
                      Expert-curated
                    </span>
                  )}
                  <Paragraph
                    key={`${i}.${j}`}
                    p={text}
                    literature={literature || []}
                    withoutIDs={withoutIDs}
                  />
                </div>
              ))
              .reduce(
                (prev, curr, key) => [
                  ...prev,
                  prev.length ? <br key={key} /> : null,
                  curr,
                ],
                [] as (JSX.Element | null)[],
              ),
          )
          .reduce(
            (prev, curr, key) => [
              ...prev,
              prev.length ? (
                <hr key={key} style={{ border: '1px solid transparent' }} />
              ) : null,
              curr,
            ],
            [] as ((JSX.Element | null)[] | JSX.Element | null)[],
          )}
      </div>
    );
  }
}
export default Description;
