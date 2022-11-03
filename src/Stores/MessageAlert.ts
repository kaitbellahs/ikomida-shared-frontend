import BaseStore from './BaseStore.js'

export interface IMessageAlert {
  code?: string
  title?: string
  error?: string
  message?: string
}
export interface IMessageAlertStore {
  object: IMessageAlert | string
  callback: Function | undefined
}
export default class MessageAlert extends BaseStore<IMessageAlertStore> {
  createStore() {
    return super.createStore(undefined)
  }

  show(object: IMessageAlert | string, callback: Function | undefined = undefined) {
    return this.store?.set({ object, callback })
  }

  hide() {
    return this.reset()
  }
}
