import BaseStore from './BaseStore.js'

export default class Title extends BaseStore<string> {
  createStore() {
    return super.createStore('')
  }

  set(payload: string) {
    const store = this.store
    return store?.set(payload)
  }
}
