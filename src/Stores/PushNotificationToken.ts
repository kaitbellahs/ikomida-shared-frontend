import BaseStore from './BaseStore.js'

export default class PushNotificationToken extends BaseStore<string> {
  setToken(payload: string) {
    const store = this.store
    return store?.set(payload)
  }
}
