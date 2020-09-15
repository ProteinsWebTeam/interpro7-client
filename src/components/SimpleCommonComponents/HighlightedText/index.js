import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { subsetText, findStart } from 'utils/text';

// we want the center of the first highlight to be at about a fourth of the text
const CENTER_OF_HIGHLIGHT = 0.25;

const findStartCentered = findStart(CENTER_OF_HIGHLIGHT);

/*:: type Props = {
  text: string | number,
  textToHighlight?: string,
  maxLength?: number
 } */

export class HighlightedText extends PureComponent /*:: <Props> */ {
  static propTypes = {
    text: T.oneOfType([T.string, T.number]).isRequired,
    textToHighlight: T.string,
    maxLength: T.number,
    shouldHighlight: T.bool,
  };

  render() {
    const {
      text,
      textToHighlight = '',
      maxLength = +Infinity,
      shouldHighlight = true,
    } = this.props;
    if (!shouldHighlight || !textToHighlight || !text) return text;
    let _text = text.toString();
    _text = subsetText(
      _text,
      findStartCentered(_text, textToHighlight, maxLength),
      maxLength,
    );
    const textLessWildcards = textToHighlight.replace(/[\*\+\?]/, '');

    return _text
      .split(new RegExp(`(${textLessWildcards})`, 'i'))
      .map((e, i) =>
        e.toLowerCase() === textLessWildcards.toLowerCase() ? (
          <mark key={i}>{e}</mark>
        ) : (
          <span key={i}>{e}</span>
        ),
      );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  (ui) => ({ shouldHighlight: ui.shouldHighlight }),
);

export default connect(mapStateToProps)(HighlightedText);
