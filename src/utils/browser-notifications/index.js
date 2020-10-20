import { noop } from 'lodash-es';
import interproLogo from '../../images/logo/logo_1776x1776.png';

export const askNotificationPermission = (setStatus = noop) => {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      setStatus(Notification.permission === 'default' ? 'not yet' : 'answered');
    });
  } else {
    console.log('This browser does not support notifications.');
  }
};

export const createNotification = (title, text) => {
  return new Notification(title, { body: text, icon: interproLogo });
};
