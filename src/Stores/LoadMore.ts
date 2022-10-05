import BaseStore from './BaseStore.js'

export default class LoadMore extends BaseStore<boolean> {
  createStore() {
    return super.createStore(false)
  }

  refresh() {
    return this.store?.set(true)
  }

  completed() {
    return this.store?.set(false)
  }
}
