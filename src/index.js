import { main, handleError } from 'main';

window.addEventListener('unhandledrejection', handleError);

main().catch(handleError);

if (module.hot) {
  module.hot.accept(function (err) {
    console.log('An error occurred while accepting new version');
  });
}
