/* eslint-env node */
const HtmlWebpackPlugin = require('html-webpack-plugin');
class LegacyModuleSplitPlugin {
  constructor(options) {
    this._options = options; // Not in use now, but just in case for the future
    this._code = [];
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('LegacyModuleSplitPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        'LegacyModuleSplitPlugin',
        this.beforeAssetTagGeneration.bind(this)
      );
    });
  }

  beforeAssetTagGeneration(data, callback) {
    this._code = [...this._code, ...data.assets.js];
    data.plugin.options.moduleScripts = this._code.filter(path =>
      path.includes('.module.')
    );
    data.plugin.options.legacyScripts = this._code.filter(path =>
      path.includes('.legacy.')
    );
    callback(null, data);
  }
}

module.exports = LegacyModuleSplitPlugin;
