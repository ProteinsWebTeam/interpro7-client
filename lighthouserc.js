module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4000/interpro/'],
      startServerCommand: 'mv dist interpro && http-server -p 4000',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
