module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8888/interpro/'],
      startServerCommand: 'npm run serve',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
