// @flow
export default () => new Promise(res => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function handleReady() {
      document.removeEventListener('DOMContentLoaded', handleReady);
      res();
    });
  } else {
    res();
  }
});
