/* eslint-env node */
/* eslint no-param-reassign: 0 */
/* eslint no-magic-numbers: 0 */
/* eslint max-statements: 0 */
/* class WebAppManifestPlugin {
  constructor({
    output = Error('undefined output'),
    content = {},
    indent = 2,
  }) {
    this.output = output;
    this.content = content;
    this.indent = indent;
  }

  processContent() {
    return Object.keys(this.content).reduce((acc, key) => {
      const value = this.content[key];
      try {
        acc[key] = value();
      } catch (_) {
        acc[key] = value;
      }
      return acc;
    }, Object.create(null));
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const manifestString = JSON.stringify(
        Object.assign(this.processContent(), compilation.assets),
        (key, value) => {
          if (key === 'data' && Array.isArray(value)) {
            return undefined;
          }
          return value;
        },
        this.indent
      );
      compilation.assets[this.output] = {
        source: () => manifestString,
        size: () => manifestString.length,
      };
      callback();
    });
  }
}*/

class WebAppManifestPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      // TODO: clean-up, put into separate functions
      // Get everything we need
      const index = Object.keys(compilation.assets)
          .find(n => n.endsWith('index.html')),
        manifest = Object.keys(compilation.assets)
          .find(n => n.endsWith('manifest.json'));
      let indexContent = compilation.assets[index].source(),
        manifestContent = compilation.assets[manifest]._value;
      const manifestPath = compiler.options.output.publicPath + manifest,
        iconPathPrefix = manifestPath.replace('manifest.json', ''),
        [closingHead] = indexContent.match(/^\s*<\/head>/m),
        indent = closingHead.replace('</head>', '').repeat(2);

      // Transform
      indexContent = indexContent.replace(
        closingHead,
        `${indent}<link rel="manifest" href="${manifestPath}">\n${closingHead}`
      );
      manifestContent = manifestContent.replace(
        /("src":\s*")/g,
        `$1${iconPathPrefix}`
      );
      // Replace in assets
      compilation.assets[index] = {
        source: () => indexContent,
        size: () => indexContent.length,
      };
      // TODO: absolutely have to remove this...
      const parsedManifest = JSON.parse(manifestContent);
      parsedManifest.start_url = compiler.options.output.publicPath;
      manifestContent = JSON.stringify(parsedManifest, null, 2);
      compilation.assets[manifest] = {
        source: () => manifestContent,
        size: () => manifestContent.length,
      };
      // Move on
      callback();
    });
  }
}

module.exports = WebAppManifestPlugin;
