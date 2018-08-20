import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import template from 'lodash-es/template';
import ClipboardJS from 'clipboard';

import SyntaxHighlighter, {
  registerLanguage,
} from 'react-syntax-highlighter/light';
import js from 'react-syntax-highlighter/languages/hljs/javascript';
import python from 'react-syntax-highlighter/languages/hljs/python';
import docco from 'react-syntax-highlighter/styles/hljs/docco';

import blockEvent from 'utils/block-event';

import { addToast } from 'actions/creators';

import jsRaw from 'raw-loader!../../../snippets/node/template.js.tmpl';
import pythonRaw from 'raw-loader!../../../snippets/python/template.py';

import f from 'styles/foundation';

registerLanguage('javascript', js);
registerLanguage('python', python);

// Need to specify that, otherwise tries to interpolate ES2015 template strings
const options = { interpolate: /<%=([\s\S]+?)%>/g };
const lut = new Map([
  [
    'js',
    { template: template(jsRaw, options), type: 'application/javascript' },
  ],
  [
    'py',
    { template: template(pythonRaw, options), type: 'application/x-python' },
  ],
]);

const TTL = 3000; // keep notification about copy to clipboard for 3 seconds

export class Snippet extends PureComponent {
  static propTypes = {
    addToast: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { language: 'js', code: null, href: null };

    this._ref = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const langInfo = lut.get(prevState.language);
    const code = langInfo.template(nextProps);
    if (code === prevState.code) return null;
    URL.revokeObjectURL(prevState.href);
    const href = URL.createObjectURL(new Blob([code], { type: langInfo.type }));
    return { code, href };
  }

  componentDidMount() {
    if (!this._ref.current) return;
    this._clipboard = new ClipboardJS(this._ref.current, {
      text: () => this.state.code,
    });
    this._clipboard.on('success', () =>
      this.props.addToast(
        {
          title: 'Copy successful',
          body: 'This snippet of code is now in your clipboard',
          ttl: TTL,
        },
        'clipboard',
      ),
    );
    this._clipboard.on('error', () =>
      this.props.addToast(
        {
          title: 'Error while copying',
          body:
            'An error happened while trying to copy this snippet of code in your clipboard',
          ttl: TTL,
          className: f('alert'),
        },
        'clipboard',
      ),
    );
  }

  componentWillUnmount() {
    if (this._clipboard) this._clipboard.destroy();
  }

  _handleChange = blockEvent(({ target: { value: language } }) =>
    this.setState({ language }),
  );

  render() {
    const { language, code, href } = this.state;
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
              <option value="py">Python (version ≥ 3)</option>
            </select>
          </label>
          <button
            type="button"
            className={f('button', 'hollow')}
            ref={this._ref}
          >
            Copy code to clipboard
          </button>
          <a
            className={f('button', 'hollow')}
            download={`script-InterPro.${language}`}
            href={href}
          >
            Download script file
          </a>
          <SyntaxHighlighter language="javascript" style={docco}>
            {code}
          </SyntaxHighlighter>
        </div>
      </section>
    );
  }
}

export default connect(
  undefined,
  { addToast },
)(Snippet);
