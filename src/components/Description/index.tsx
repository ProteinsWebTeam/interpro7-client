/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';

import { transformFormatted } from 'utils/text';

import BadgeAI, { BadgeCurated } from 'components/Entry/BadgeAI';
import Paragraph from './Paragraph';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import description from 'src/reducers/custom-location/description';

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
  /**
   * Array of strings or objects. Each willbe represented as a paragraph
   */
  textBlocks: Array<string | StructuredDescription>;
  /**
   * If the description has inline references, the literature can be included here to coordinate the numbering with the `<Literature>` component.
   */
  literature?: Array<[string, Reference]>;
  /**
   * To exclude the creation of IDs in the link elements
   */
  withoutIDs?: boolean;
  /**
   * To display the badges for AI-Generated or Expert curated paragraphs
   */
  showBadges?: boolean;
};
class Description extends PureComponent<Props> {
  render() {
    const { textBlocks, literature, withoutIDs, showBadges } = this.props;
    const sections = textBlocks.map((e) => {
      return (transformFormatted(getDescriptionText(e)) as string[]).map(
        (text) => ({
          text,
          llm: typeof e === 'string' ? false : e.llm,
          checked: typeof e === 'string' ? false : e.checked,
          updated: typeof e === 'string' ? false : e.updated,
        }),
      );
    });

    return (
      <div className={css('description')} data-testid="description">
        {sections
          .map((section, i) =>
            section
              .map(({ text, llm, checked, updated }, j) => (
                <div
                  className={css('content', {
                    llm,
                    checked,
                    bordered: showBadges,
                  })}
                  key={`${i}_${j}`}
                >
                  {showBadges &&
                    (llm ? (
                      <BadgeAI checked={checked} updated={updated} />
                    ) : (
                      <BadgeCurated />
                    ))}

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
