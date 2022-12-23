import BaseStore from './BaseStore.js'
import TScroll from '../Types/TScroll.js'

export default class MainScroll extends BaseStore<TScroll> {
  createStore() {
    return super.createStore(new TScroll())
  }

  set(scroll: TScroll) {
    return this.store?.set(scroll)
  }
}
