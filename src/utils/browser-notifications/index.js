export const askNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    });
  } else {
    console.log('This browser does not support notifications.');
  }
};

export const createNotification = (title, text, img) => {
  return new Notification(title, { body: text, icon: img });
};
