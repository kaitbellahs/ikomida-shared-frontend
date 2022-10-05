export interface ISelectorOptions {
  [x: string]: any
  id: any
  name: any
  hasOwnProperty: (arg0: string) => any
}
export default class SelectorOptions {
  id
  name
  constructor(object: ISelectorOptions) {
    this.id = object?.id
    this.name = object?.name
    for (const prop in object) {
      if (Object.prototype.hasOwnProperty.call(object, prop) && prop != 'id' && prop != 'name') {
        ;(this as any)[prop] = object?.[prop]
      }
    }
  }
}
