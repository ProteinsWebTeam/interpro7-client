module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8000/interpro'],
      startServerCommand: 'mv dist interpro && npx http-server',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
