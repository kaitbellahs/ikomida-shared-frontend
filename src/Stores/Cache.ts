import type { Interfaces, Classes } from '@ikomida/shared-types';
import BaseStore from './BaseStore';

export default class Cache extends BaseStore<Interfaces.IRecord<string, Classes.BaseJSON[] | null>> {
  static Types = {
    ORDERS: 'ORDERS',
    PUSH_NOTIFICATIONS: 'PUSH_NOTIFICATIONS',
    COUPONS: 'COUPONS',
    STAFF: 'STAFF',
    CONTRACTS: 'CONTRACTS',
    PLANS: 'PLANS',
    APPS: 'APPS',
    RESELLERS: 'RESELLERS',
    SETTINGS: 'SETTINGS',
    TERMS: 'TERMS',
    BANK_ACCOUNTS: 'BANK_ACCOUNTS',
  };

  createStore() {
    return super.createStore({});
  }

  setObject(name: string, value: any) {
    const store = this.store;
    return store.update((items) => {
      if (!items) {
        items = {};
      }
      items[name] = value;
      return items;
    });
  }

  getObject(name: string) {
    const items = this.data;
    return items?.[name];
  }
}
