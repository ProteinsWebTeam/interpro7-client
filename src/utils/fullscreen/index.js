export const requestFullScreen = (element) => {
  if ('requestFullscreen' in element) {
    return element.requestFullscreen();
  } else if ('webkitRequestFullscreen' in element) {
    return element.webkitRequestFullscreen();
  } else if ('mozRequestFullScreen' in element) {
    return element.mozRequestFullScreen();
  } else if ('msRequestFullscreen' in element) {
    return element.msRequestFullscreen();
  }
};

export const exitFullScreen = () => {
  if ('exitFullscreen' in document) {
    return document.exitFullscreen();
  } else if ('webkitExitFullscreen' in document) {
    return document.webkitExitFullscreen();
  } else if ('mozExitFullScreen' in document) {
    return document.mozExitFullScreen();
  } else if ('msExitFullscreen' in document) {
    return document.msExitFullscreen();
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
