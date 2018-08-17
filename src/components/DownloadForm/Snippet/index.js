import React, { PureComponent } from 'react';
import T from 'prop-types';
import template from 'lodash-es/template';

import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/light';
import js from 'react-syntax-highlighter/languages/hljs/javascript';
import python from 'react-syntax-highlighter/languages/hljs/python';
import docco from 'react-syntax-highlighter/styles/hljs/docco';

import blockEvent from 'utils/block-event';

import jsRaw from 'raw-loader!../../../snippets/node/template.js.tmpl';
import pythonRaw from 'raw-loader!../../../snippets/python/template.py';

registerLanguage('javascript', js);
registerLanguage('python', python);

// Need to specify that, otherwise tries to interpolate ES2015 template strings
const options = { interpolate: /<%=([\s\S]+?)%>/g };
const lut = new Map([
  ['js', template(jsRaw, options)],
  ['python', template(pythonRaw, options)],
]);

export default class Snippet extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { language: 'js' };
  }

  _handleChange = blockEvent(({ target: { value: language } }) =>
    this.setState({ language }),
  );

  render() {
    const { language } = this.state;
    const template = lut.get(language);
    return (
      <section>
        <h6>Code snippet</h6>
        <p>
          Below you can find some code to generate the file directly from your
          computer. Feel free to make changes to adapt it to your needs.
        </p>
        <div>
          <label>
            Select your language:
            <select
              onChange={this._handleChange}
              onBlur={this._handleChange}
              value={language}
            >
              <option value="js">JavaScript (node, version ≥ 10)</option>
              <option value="python">Python (version ≥ 3)</option>
            </select>
          </label>
          <SyntaxHighlighter language="javascript" style={docco}>
            {template({ ...this.props })}
          </SyntaxHighlighter>
        </div>
      </section>
    );
  }
}
