import React, { PureComponent } from 'react';
import T from 'prop-types';

class HighlightedText extends PureComponent {
  static propTypes = {
    text: T.oneOfType([T.string, T.number]).isRequired,
    textToHighlight: T.string,
  };

  render() {
    const { text, textToHighlight = '' } = this.props;
    if (!textToHighlight) return text;
    return text
      .toString()
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
