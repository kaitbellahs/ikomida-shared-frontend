import { Subscriber, Unsubscriber, writable, get } from 'svelte/store'
import { Preferences } from '@capacitor/preferences'

export interface IStore {
  subscribe: (
    this: void,
    run: Subscriber<string>,
    invalidate?: ((value?: string | null | undefined) => void) | undefined
  ) => Unsubscriber
  setToken: (payload: string) => Promise<void>
}

export class Auth {
  //MARK: -- static region
  static instance: Auth
  unsubscribe: any
  static createInstance(name: string) {
    if (!Auth.instance) {
      Object.defineProperty(Auth, 'instance', {
        value: new Auth(name),
        writable: false,
        enumerable: false,
        configurable: false
      })
    }
    return Auth.instance
  }

  //MARK: -- instance region
  name = 'AuthToken'
  private storeValue?: IStore
  constructor(name: string) {
    this.name = `AuthToken:${name}`
  }
  async setter() {
    let token = ''
    try {
      token =
        (
          await Preferences.get({
            key: this.name
          })
        ).value ?? ''
    } catch (_) {}
    return (setter: Subscriber<string>): void | Unsubscriber => {
      setter(token)
    }
  }

  async createStore() {
    const { subscribe, set } = writable('', (await this.setter()).bind(this))

    return {
      subscribe,
      setToken: async (payload: string) => {
        try {
          set(payload)
          await Preferences.set({
            key: this.name,
            value: payload
          })
        } catch (error: any) {
          //TODO: -- report errors
        }
      }
    }
  }

  async store(): Promise<IStore> {
    if (!this.storeValue) {
      this.storeValue = await this.createStore()
    }
    return this.storeValue
  }

  async subscribe(callBack: Subscriber<string>) {
    this.unsubscribe = (await this.store()).subscribe(callBack)
  }

  destroy() {
    this.unsubscribe?.()
  }

  async data() {
    const store = await this.store()
    return get(store)
  }

  async setToken(payload: string) {
    const store = await this.store()
    return store?.setToken(payload)
  }
}
