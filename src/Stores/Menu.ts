import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidV4 } from 'uuid';
import BaseStore from './BaseStore';

export interface MenuItem {
  name: string;
  uuid?: string;
  icon?: IconDefinition;
  callback?: Function;
}

export default class Menu extends BaseStore<MenuItem[]> {
  createStore() {
    return super.createStore([]);
  }

  addItem(payload: MenuItem) {
    const store = this.store;
    if (payload && !payload?.uuid) {
      payload.uuid = uuidV4();
    }
    return store.update((items) => [...(items ?? []), payload]);
  }
}
