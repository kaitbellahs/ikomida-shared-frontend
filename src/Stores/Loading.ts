import BaseStore from './BaseStore.js'

export default class Loading extends BaseStore<number> {
  createStore() {
    return super.createStore(0)
  }

  start() {
    return this.store?.set((this.data ?? 0) >= 0 ? (this.data ?? 0) + 1 : 1)
  }

  stop() {
    return this.store?.set((this.data ?? 0) > 0 ? (this.data ?? 0) - 1 : 0)
  }
}
