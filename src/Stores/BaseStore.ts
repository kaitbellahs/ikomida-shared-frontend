import { Subscriber, Writable, writable, get } from 'svelte/store'

export default abstract class BaseStore<T> {
  //MARK: -- static region
  static instance: any
  static createInstance(...args: any[]) {
    if (!this.instance) {
      Object.defineProperty(this, 'instance', {
        value: new (this as any)(...args),
        writable: false,
        enumerable: false,
        configurable: false
      })
    }
    return this.instance
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(...args: any[]) {}

  //MARK: -- instance region
  private storeValue?: Writable<T | undefined>
  private initialValue?: T | undefined
  private unsubscribe?: () => void

  createStore(initialValue: T | undefined = undefined) {
    this.initialValue = initialValue
    return writable<T | undefined>(this.initialValue)
  }

  get store() {
    if (!this.storeValue) {
      this.storeValue = this.createStore()
    }
    return this.storeValue
  }

  subscribe(callBack: Subscriber<T | undefined>) {
    this.unsubscribe = this.store.subscribe(callBack)
  }

  destroy() {
    this.unsubscribe?.()
  }

  get data() {
    const store = this.store
    return get(store)
  }

  reset(...args: any[]) {
    const store = this.store
    return store?.set(this.initialValue ? this.initialValue : undefined)
  }
}
