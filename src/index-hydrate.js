import { main, handleError } from 'main';

window.addEventListener('unhandledrejection', handleError);

main(true).catch(handleError);
