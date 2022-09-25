import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export default class PushNotification {
  hasRegisteredCallBack;
  receivedCallBack;
  actionPerformedCallBack;
  errorCallBack;
  permissionCallBack;

  constructor(
    hasRegisteredCallBack: any,
    receivedCallBack: any,
    actionPerformedCallBack: any,
    errorCallBack: any,
    permissionCallBack: any,
  ) {
    this.hasRegisteredCallBack = hasRegisteredCallBack;
    this.receivedCallBack = receivedCallBack;
    this.actionPerformedCallBack = actionPerformedCallBack;
    this.errorCallBack = errorCallBack;
    this.permissionCallBack = permissionCallBack;
  }

  async init() {
    await PushNotifications.addListener('registration', async (token) => {
      const platform = Capacitor.getPlatform();
      await this.hasRegisteredCallBack(token.value, platform);
    });

    await PushNotifications.addListener('registrationError', (error) => {
      this.errorCallBack(error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.receivedCallBack(notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      this.actionPerformedCallBack(notification);
    });
    let permissionStatus = await PushNotifications.checkPermissions();

    if (permissionStatus.receive === 'prompt') {
      permissionStatus = await PushNotifications.requestPermissions();
    }

    if (permissionStatus.receive !== 'granted') {
      //TODO: -- report error
    }
    this.permissionCallBack(permissionStatus);

    await PushNotifications.register();
  }
}
