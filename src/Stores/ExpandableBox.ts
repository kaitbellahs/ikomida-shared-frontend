import BaseStore from './BaseStore.js'

export default class ExpandableBox extends BaseStore<string> {
  createStore() {
    return super.createStore("")
  }

  toggle(id: string) {
    return this.store?.set(id)
  }
}
