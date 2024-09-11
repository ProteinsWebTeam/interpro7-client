import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { subsetText, findStart } from 'utils/text';

// we want the center of the first highlight to be at about a fourth of the text
const CENTER_OF_HIGHLIGHT = 0.25;

const findStartCentered = findStart(CENTER_OF_HIGHLIGHT);

type Props = {
  text: string | number;
  textToHighlight?: string;
  maxLength?: number;
  shouldHighlight?: boolean;
};

export const HighlightedText = ({
  text,
  textToHighlight = '',
  maxLength = +Infinity,
  shouldHighlight = true,
}: Props) => {
  if (!textToHighlight || !text) return text;
  let _text = text.toString();
  _text = subsetText(
    _text,
    findStartCentered(_text, textToHighlight, maxLength),
    maxLength,
  );
  if (!shouldHighlight) return _text;
  const textLessWildcards = textToHighlight.replace(/[*+?]/, '');

  return _text
    .split(new RegExp(`(${textLessWildcards})`, 'i'))
    .map((e, i) =>
      e.toLowerCase() === textLessWildcards.toLowerCase() ? (
        <mark key={i}>{e}</mark>
      ) : (
        <span key={i}>{e}</span>
      ),
    );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({ shouldHighlight: ui.shouldHighlight }),
);

export default connect(mapStateToProps)(HighlightedText);
