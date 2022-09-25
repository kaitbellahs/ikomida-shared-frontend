import BaseStore from './BaseStore';

export interface IMessageAlert {
  code?: string;
  title?: string;
  error?: string;
  message?: string;
}
export interface IMessageAlertStore {
  object: IMessageAlert | string;
  callback: Function | null;
}
export default class MessageAlert extends BaseStore<IMessageAlertStore> {
  createStore() {
    return super.createStore(null);
  }

  show(object: IMessageAlert | string, callback: Function | null = null) {
    return this.store?.set({ object, callback });
  }

  hide() {
    return this.reset();
  }
}
