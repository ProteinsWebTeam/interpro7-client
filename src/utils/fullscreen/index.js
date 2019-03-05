export const requestFullScreen = element => {
  if ('requestFullscreen' in element) {
    element.requestFullscreen();
  } else if ('webkitRequestFullscreen' in element) {
    element.webkitRequestFullscreen();
  } else if ('mozRequestFullScreen' in element) {
    element.mozRequestFullScreen();
  } else if ('msRequestFullscreen' in element) {
    element.msRequestFullscreen();
  }
};

export const exitFullScreen = () => {
  if ('exitFullscreen' in document) {
    document.exitFullscreen();
  } else if ('webkitExitFullscreen' in document) {
    document.webkitExitFullscreen();
  } else if ('mozExitFullScreen' in document) {
    document.mozExitFullScreen();
  } else if ('msExitFullscreen' in document) {
    document.msExitFullscreen();
  }
};

export const onFullScreenChange = (element, callback) => {
  if ('onfullscreenchange' in element) {
    element.onfullscreenchange = callback;
  } else if ('onwebkitfullscreenchange' in element) {
    element.onwebkitfullscreenchange = callback;
  } else if ('onmozfullscreenchange' in element) {
    element.onmozfullscreenchange = callback;
  } else if ('onfullscreenchange' in document) {
    document.onfullscreenchange = callback;
  } else if ('onwebkitfullscreenchange' in document) {
    document.onwebkitfullscreenchange = callback;
  } else if ('onmozfullscreenchange' in document) {
    document.onmozfullscreenchange = callback;
  } else if ('onMSFullscreenChange' in document) {
    document.onMSFullscreenChange = callback;
  }
};
