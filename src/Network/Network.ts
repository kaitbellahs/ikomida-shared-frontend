import { Http, HttpOptions, HttpParams, HttpResponse } from '@capacitor-community/http'
import { Capacitor } from '@capacitor/core'
import { Classes, Interfaces } from '@ikomida/shared-types'
import { Auth } from '../Stores/Auth.js'
import Cache from '../Stores/Cache.js'
import MessageAlert from '../Stores/MessageAlert.js'
import { capitalizeFirstLeter } from '../Utils/Strings.js'
import _ from 'lodash'

export default class Network {
  //MARK: -- static region
  static Methods: any = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'del',
    PATCH: 'patch'
  }

  static instance?: Network
  static createInstance(apiServer: string, XiKomidaID: string, agent: string, grecaptchaKey: string, version: string) {
    if (!Network.instance) {
      Object.defineProperty(Network, 'instance', {
        value: new Network(apiServer, XiKomidaID, agent, grecaptchaKey, version),
        writable: false,
        enumerable: false,
        configurable: false
      })
    }
    return Network.instance
  }

  //MARK: -- instance region
  apiServer
  XiKomidaID
  agent
  grecaptchaKey
  deviceId?: string
  auth?: Auth
  cache: Cache
  version
  canGetMore: any = {}
  items: Interfaces.IRecord<string, any | undefined> = {}

  constructor(apiServer: string, XiKomidaID: string, agent: string, grecaptchaKey: string, version: string) {
    this.apiServer = apiServer
    this.XiKomidaID = XiKomidaID
    this.agent = agent
    this.grecaptchaKey = grecaptchaKey
    this.version = version
    this.setDeviceId().then()
    this.auth = Auth.instance
    this.cache = Cache.instance
  }

  async setDeviceId() {
    try {
      const { Device } = await import('@capacitor/device')
      this.deviceId = (await Device.getId())?.uuid
    } catch (error: any) {
      //TODO: --report error
    }
  }

  async clearCache(name: string) {
    this.canGetMore[name] = true
    this.items[name] = undefined
    return this.cache.setObject(name, undefined)
  }

  async clearAllCache() {
    this.items = {}
    this.canGetMore = {}
    return this.cache.reset()
  }

  async getItens(url: string, auth: boolean, params?: HttpParams, timestamp = 0) {
    const response = await this.get(`${url}/${timestamp}`, auth, params)
    let itens: any[] = []
    if (response?.success) {
      itens = response?.data ?? []
    } else {
      ;(MessageAlert.instance as MessageAlert)?.show(response?.data as string)
    }
    return itens
  }

  async loadMore(name: string, url: string, auth: boolean, params?: HttpParams, refresh = false) {
    if (!name || !url) {
      throw Error('loadMore: cache name and url is not setted!')
    }
    if (!(name in this.canGetMore)) {
      this.canGetMore[name] = true
    }
    if (!(name in this.items)) {
      this.items[name] = undefined
    }
    if (refresh || this.canGetMore?.[name]) {
      const timestamp = refresh ? 0 : this.items?.[name]?.[(this.items?.[name]?.length ?? 0) - 1]?.timestamp ?? 0
      if (!refresh) {
        this.items[name] = this.cache.getObject(name)
      }
      const newitems = await this.getItens(url, auth, params, timestamp)
      this.canGetMore[name] = ((newitems as any)?.length ?? 0) === 10
      this.items[name] = refresh
        ? newitems
        : this.items?.[name]
        ? [...(this.items?.[name] ?? []), ...(newitems as any)]
        : newitems
      this.items?.[name]?.sort(
        (item1: Classes.BaseJSON & { order: number }, item2: Classes.BaseJSON & { order: number }) =>
          (item1?.order ?? item2?.timestamp ?? 0) - (item2?.order ?? item1?.timestamp ?? 0)
      )
      this.items[name] = _.uniqBy(this.items?.[name], 'id')
      this.cache.setObject(name, this.items?.[name])
    }
    return [this.canGetMore?.[name], this.items?.[name]]
  }

  setIkomidaID(ikomidaid: string) {
    this.XiKomidaID = ikomidaid
  }

  async logout(): Promise<Classes.Return<any>> {
    const response = await this.remove('/logout', true, undefined, 'logout', false)
    if ((response.data as Classes.Return<boolean>)?.success || response.status === 401) {
      await Network.instance?.clearAllCache()
      await this.auth?.setToken('')
    }
    return response
  }
  async get(url: string, auth = false, params?: HttpParams, action?: string, parseResponse = true) {
    return this.request(Network.Methods.GET, url, auth, params, undefined, action, parseResponse)
  }
  async post(url: string, auth = false, data?: any, action?: string, parseResponse = true) {
    return this.request(Network.Methods.POST, url, auth, undefined, data, action, parseResponse)
  }
  async put(url: string, auth = false, data?: any, action?: string, parseResponse = true) {
    return this.request(Network.Methods.PUT, url, auth, undefined, data, action, parseResponse)
  }
  async patch(url: string, auth = false, data?: any, action?: string, parseResponse = true) {
    return this.request(Network.Methods.PATCH, url, auth, undefined, data, action, parseResponse)
  }
  async remove(url: string, auth = false, data?: any, action?: string, parseResponse = true) {
    return this.request(Network.Methods.DELETE, url, auth, undefined, data, action, parseResponse)
  }

  async request(
    method: string,
    url: string,
    auth = false,
    params?: HttpParams,
    data?: any,
    action?: string,
    parseResponse = true
  ) {
    const XiKomidaTimestamp = `${Date.now()}`
    const options = {
      url: this.apiServer + url,
      headers: {
        'X-iKomida-ID': `${this.XiKomidaID.toLowerCase()}`,
        'X-iKomida-Agent': `${this.agent}`,
        'X-iKomida-Timestamp': XiKomidaTimestamp,
        'X-iKomida-Plateform': `${Capacitor.getPlatform()}`,
        accept: `application/json`,
        'X-Requested-With': `iKomida-${capitalizeFirstLeter(this.agent)} V${this.version}`
      }
    } as HttpOptions
    if (options.headers && this.deviceId) {
      options.headers['X-iKomida-DId'] = this.deviceId
    }
    if (data && options.headers) {
      options.headers['Content-Type'] = 'application/json'
      options.data =
        data instanceof Classes.BaseJSON || new data.constructor() instanceof Classes.BaseJSON ? data.toJSON() : data
    }
    if (params) options.params = params
    if (auth && this.auth && options.headers) options.headers.authorization = `Bearer ${await this.auth?.data()}`
    if (action && options.headers) {
      options.headers.challenge = await this.getRecaptcha(action)
    }
    let response
    if (method && this.methodsList().includes(method)) {
      try {
        response = (await ((Http as any)[method] as Function)(options)) as HttpResponse
      } catch (exception) {
        //TODO: report errors
        return {
          success: false,
          data: {
            message: 'Não foi possível completar essa chamada (erro interno do serviço ou falha na conexão)'
          }
        }
      }
    }
    return parseResponse ? this.parseResponse(response) : response
    // options.headers.signature = await signMessage(options);
  }

  async parseResponse(res?: HttpResponse) {
    const data = res?.data
    if (res?.status === 401) {
      await this.logout()
      return data
    } else if (res?.status && res?.status >= 200 && res?.status < 300) {
      return new Classes.Return(
        data.success,
        Array.isArray(data.data) ? _.sortBy(data.data, 'order') : data.data,
        res?.status
      )
    } else if (res?.status && res?.status >= 400 && res?.status < 500) {
      return (
        data ?? {
          success: false,
          data: {
            error: 'Essa operação não é autorizada ou concluída, entre em contato com o suporte!'
          }
        }
      )
    } else if (res?.status && res?.status >= 500 && res?.status < 600) {
      //TODO: report errors
      return (
        data ?? {
          success: false,
          data: {
            error:
              'Ocorreu um erro interno nos serviços, tente de novo mais tarde. Se o erro persiste entre em contato com nosso suporte!'
          }
        }
      )
    } else {
      //TODO: report errors
      return (
        data ?? {
          success: false,
          data: {
            error:
              'Ocorreu um erro indefinido, verifique a qualidade da sua conexão à internet e tente de novo mais tarde. Se o erro persiste entre em contato com nosso suporte.!'
          }
        }
      )
    }
  }

  async getRecaptcha(action: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (grecaptcha && this.grecaptchaKey) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await grecaptcha.execute(this.grecaptchaKey, {
          action
        })
      }
    } catch (e) {
      //TODO: report errors
    }
    return ''
  }

  methodsList() {
    return Object.keys(Network.Methods).map(item => Network.Methods[item])
  }
}
