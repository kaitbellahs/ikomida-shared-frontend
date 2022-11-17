import { Classes } from '@ikomida/shared-types'
import BaseStore from './BaseStore.js'

export default class Layout extends BaseStore<Classes.CLayout> {
  createStore() {
    return super.createStore(
      new Classes.CLayout({
        link: '#e8d130',
        background: '#dfdfdf',
        itemBackground: '#fffffffc',
        color: '#000000',
        header: {
          color: '#ffffff',
          background: '#4c0708',
          menuHamburger: '#ffffff'
        },
        tabs: { background: '#ffe4c4', color: '#4c0708' },
        button: { background: '#4c0708', color: 'white' },
        dialog: { background: '#ffffffdf', color: '#4c0708' }
      })
    )
  }
  set(data: Classes.CLayout) {
    const store = this.store
    return store.set(data)
  }
}
