module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: async (config) => {
    // do mutation to the config

    return config;
  },
};
