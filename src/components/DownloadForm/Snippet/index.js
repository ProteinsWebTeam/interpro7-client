import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { template } from 'lodash-es';
import ClipboardJS from 'clipboard';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import perl from 'react-syntax-highlighter/dist/esm/languages/hljs/perl';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';

import blockEvent from 'utils/block-event';

import { addToast } from 'actions/creators';

import jsRaw from 'raw-loader!../../../snippets/template.js.tmpl';
import pythonRaw from 'raw-loader!../../../snippets/template.py.tmpl';
import python2Raw from 'raw-loader!../../../snippets/template.py2.tmpl';
import perlRaw from 'raw-loader!../../../snippets/template.pl.tmpl';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import { foundationPartial } from 'styles/foundation';

const f = foundationPartial(fonts, ebiGlobalStyles);

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('perl', perl);

// Need to specify that, otherwise tries to interpolate ES2015 template strings
const options = { interpolate: /<%=([\s\S]+?)%>/g };
const lut = new Map([
  [
    'py',
    {
      template: template(pythonRaw, options),
      type: 'application/x-python',
      syntax: 'python',
    },
  ],
  [
    'py2',
    {
      template: template(python2Raw, options),
      type: 'application/x-perl',
      syntax: 'perl',
    },
  ],
  [
    'pl',
    {
      template: template(perlRaw, options),
      type: 'application/x-perl',
      syntax: 'perl',
    },
  ],
  [
    'js',
    {
      template: template(jsRaw, options),
      type: 'application/javascript',
      syntax: 'javascript',
    },
  ],
]);

const TTL = 3000; // keep notification about copy to clipboard for 3 seconds

/*:: type Props= {|
  addToast: function
|};*/

/*:: type State= {|
  language: string,
  code: ?string,
  href: ?string
|};*/

export class Snippet extends PureComponent /*:: <Props, State> */ {
  /*::
    _ref: React$ElementRef<'button'>
    _clipboard: ClipboardJS;
  */
  static propTypes = {
    addToast: T.func.isRequired,
  };

  constructor(props /*: Props*/) {
    super(props);
    this.state = { language: 'py', code: null, href: null };
    this._ref = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const langInfo = lut.get(prevState.language);
    const code = langInfo.template(nextProps).replace(/\n{2,}/g, '\n\n');

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
          body: 'An error was encountered while trying to copy this snippet of code in your clipboard',
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
          We generally recommend you download the results of your queries
          programatically rather than through the web browser. Downloading large
          lists of results within the browser can use up a lot of memory. If you
          notice that your browser crashes when downloading one of those
          generated files, it is <strong>very likely</strong> to be because your
          computer is running out of memory.
        </p>
        <p>
          To help you download data programmatically, we have generated a
          snippet of code for you below. You can select a programming language
          from the list below, copy or download the code into a text file and
          then run the downloaded code via the selected programming language in
          a terminal. If you are getting started with programming we recommend
          looking into
          <a href="https://www.python.org/about/gettingstarted"> Python.</a>
        </p>
        <div>
          <label>
            Select your language:
            <select
              onChange={this._handleChange}
              onBlur={this._handleChange}
              value={language}
            >
              <option value="py">Python (version ≥ 3)</option>
              <option value="py2">Python (version 2)</option>
              <option value="pl">Perl (version 5)</option>
              <option value="js">JavaScript (node, version ≥ 10)</option>
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
          {language === 'js' && (
            <div className={f('callout', 'info', 'withicon')}>
              This script requires the packages: <code>node-fetch</code> and{' '}
              <code>timing-functions</code> either globally or in the local{' '}
              <code>node_modules</code>
            </div>
          )}
          <SyntaxHighlighter language={lut.get(language).syntax} style={docco}>
            {code}
          </SyntaxHighlighter>
        </div>
      </section>
    );
  }
}

export default connect(undefined, { addToast })(Snippet);
