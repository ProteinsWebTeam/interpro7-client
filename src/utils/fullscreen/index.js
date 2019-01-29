export const requestFullScreen = element => {
  console.log(`requestFullScreen`);
  if ('requestFullscreen' in element) {
    element.requestFullscreen();
  }
  if ('webkitRequestFullscreen' in element) {
    element.webkitRequestFullscreen();
  }
  if ('mozRequestFullScreen' in element) {
    element.mozRequestFullScreen();
  }
  if ('msRequestFullscreen' in element) {
    element.msRequestFullscreen();
  }
};

export const exitFullScreen = element => {
  console.log(`exitFullScreen`);
  if ('exitFullscreen' in document) {
    document.exitFullscreen();
  }
  if ('webkitExitFullscreen' in document) {
    document.webkitExitFullscreen();
  }
  if ('mozExitFullScreen' in document) {
    document.mozExitFullScreen();
  }
  if ('msExitFullscreen' in document) {
    document.msExitFullscreen();
  }
};

export const onFullScreenChange = (element, callback) => {
  console.log(`onFullScreenChange`);
  if ('onfullscreenchange' in element) {
    element.onfullscreenchange = callback;
  }
  if ('onwebkitfullscreenchange' in element) {
    element.onwebkitfullscreenchange = callback;
  }
  if ('onmozfullscreenchange' in element) {
    element.onmozfullscreenchange = callback;
  }
  if ('MSwebkitfullscreenchange' in element) {
    element.MSwebkitfullscreenchange = element;
  }
  if ('onmozfullscreenchange' in document) {
    document.onmozfullscreenchange = callback;
  }
  if ('MSwebkitfullscreenchange' in document) {
    document.MSwebkitfullscreenchange = callback;
  }
};
