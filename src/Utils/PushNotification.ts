import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'

export default class PushNotification {
  hasRegisteredCallBack
  receivedCallBack
  actionPerformedCallBack
  errorCallBack
  permissionCallBack

  constructor(
    hasRegisteredCallBack: any,
    receivedCallBack: any,
    actionPerformedCallBack: any,
    errorCallBack: any,
    permissionCallBack: any
  ) {
    this.hasRegisteredCallBack = hasRegisteredCallBack
    this.receivedCallBack = receivedCallBack
    this.actionPerformedCallBack = actionPerformedCallBack
    this.errorCallBack = errorCallBack
    this.permissionCallBack = permissionCallBack
  }

  async init() {
    await PushNotifications.addListener('registration', async token => {
      const platform = Capacitor.getPlatform()
      await this.hasRegisteredCallBack(token.value, platform)
    })

    await PushNotifications.addListener('registrationError', async error => {
      await this.errorCallBack(error)
    })

    await PushNotifications.addListener('pushNotificationReceived', async notification => {
      console.log('pushNotificationAction:pushNotificationReceived')
      await this.receivedCallBack(notification)
    })

    await PushNotifications.addListener('pushNotificationActionPerformed', async notification => {
      console.log('pushNotificationAction:pushNotificationActionPerformed')
      await this.actionPerformedCallBack(notification)
    })
    let permissionStatus = await PushNotifications.checkPermissions()

    if (permissionStatus.receive === 'prompt') {
      permissionStatus = await PushNotifications.requestPermissions()
    }

    if (permissionStatus.receive !== 'granted') {
      //TODO: -- report error
      console.log('pushNotificationAction:permissionStatus.receive!==granted')
    }
    await this.permissionCallBack(permissionStatus)

    await PushNotifications.register()
  }
}
