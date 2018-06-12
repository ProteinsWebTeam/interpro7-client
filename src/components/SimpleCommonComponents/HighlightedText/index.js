import React, { PureComponent } from 'react';
import T from 'prop-types';

import { subsetText, findStart } from 'utils/text';

// we want the center of the first highlight to be at about a fourth of the text
const CENTER_OF_HIGHLIGHT = 0.25;

const findStartCentered = findStart(CENTER_OF_HIGHLIGHT);

class HighlightedText extends PureComponent {
  static propTypes = {
    text: T.oneOfType([T.string, T.number]).isRequired,
    textToHighlight: T.string,
    maxLength: T.number,
  };

  render() {
    const { text, textToHighlight = '', maxLength = +Infinity } = this.props;
    if (!textToHighlight) return text;
    let _text = text.toString();
    _text = subsetText(
      _text,
      findStartCentered(_text, textToHighlight, maxLength),
      maxLength,
    );
    return _text
      .split(new RegExp(`(${textToHighlight})`, 'i'))
      .map(
        (e, i) =>
          e.toLowerCase() === textToHighlight.toLowerCase() ? (
            <mark key={i}>{e}</mark>
          ) : (
            <span key={i}>{e}</span>
          ),
      );
  }
}

export default HighlightedText;
