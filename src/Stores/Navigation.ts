import { derived } from 'svelte/store'
import { v4 as uuidV4 } from 'uuid'
import Menu from './Menu.js'
import BaseStore from './BaseStore.js'
import Loading from './Loading.js'
import MessageAlert from './MessageAlert.js'

export interface INavigation {
  route: Symbol
  options?: any
  uuid?: string
}

export default class Navigation extends BaseStore<INavigation[]> {
  //MARK: -- instance region
  route
  callBack?: Function
  loading: Loading

  constructor(route: Symbol) {
    super()
    this.route = route
    this.loading = Loading.createInstance()
  }

  createStore() {
    return super.createStore([
      {
        route: this.route,
        options: null,
        uuid: uuidV4()
      }
    ])
  }

  setBack(callBack: Function) {
    this.callBack = callBack
  }

  goTo(route: Symbol, options?: any) {
    ;(MessageAlert.instance as MessageAlert).hide()
    this.loading.reset()
    this.loading.start()
    Menu.instance.reset()
    return this.store.update(navigation => [
      ...(navigation ?? []),
      {
        route,
        options,
        uuid: uuidV4()
      } as INavigation
    ])
  }

  pop(count: number) {
    ;(MessageAlert.instance as MessageAlert).hide()
    this.loading.reset()
    this.loading.start()
    Menu.instance.reset()
    return this.store.update(navigation => {
      if ((navigation?.length ?? 0) > 1) {
        let itemsToRemove = 1
        if (count != undefined && typeof count === 'number' && count > 1 && count < (navigation?.length ?? 0)) {
          itemsToRemove = count
        }
        return [...(navigation ?? []).slice(0, (navigation?.length ?? 0) - itemsToRemove)]
      } else {
        return navigation
      }
    })
  }

  reset(route: Symbol): void {
    ;(MessageAlert.instance as MessageAlert).hide()
    ;(Loading.instance as Loading).start()
    Menu.instance.reset()
    return this.store.set([
      {
        route,
        uuid: uuidV4(),
        options: null
      }
    ])
  }

  get router() {
    const store = this.store
    return derived(store, $store => $store?.[$store.length - 1])
  }
}
