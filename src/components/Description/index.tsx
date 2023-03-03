/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';

import { transformFormatted } from 'utils/text';

import Paragraph from './Paragraph';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

type Props = {
  textBlocks: Array<string>;
  literature?: Array<string>;
  accession?: string;
  withoutIDs?: boolean;
};
class Description extends PureComponent<Props> {
  render() {
    const { textBlocks, literature, accession, withoutIDs } = this.props;
    const sections = textBlocks.map((e) => {
      return transformFormatted(e);
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
                  accession={accession}
                  withoutIDs={withoutIDs}
                />
              ))
              .reduce(
                (prev, curr, key) => [
                  ...prev,
                  prev.length ? <br key={key} /> : null,
                  curr,
                ],
                []
              )
          )
          .reduce(
            (prev, curr, key) => [
              ...prev,
              prev.length ? (
                <hr key={key} style={{ border: '1px solid transparent' }} />
              ) : null,
              curr,
            ],
            []
          )}
      </div>
    );
  }
}
export default Description;
