/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';

import { transformFormatted } from 'utils/text';

import Paragraph from './Paragraph';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

export const getDescriptionText = (
  description: string | StructuredDescription,
) => (typeof description === 'string' ? description : description.text);

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
      return transformFormatted(getDescriptionText(e)) as string[];
    });

    return (
      <div className={css('description')} data-testid="description">
        {sections
          .map((section, i) =>
            section
              .map((p, j) => (
                <Paragraph
                  key={`${i}.${j}`}
                  p={p}
                  literature={literature || []}
                  withoutIDs={withoutIDs}
                />
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
