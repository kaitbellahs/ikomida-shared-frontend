import { Classes, Decorators, Types } from '@ikomida/shared-types'

export default class CCartProductOption extends Classes.CProductOption {
  @Decorators.Property.Property
  maxUnits!: number

  static initCartProductOption(
    name: string,
    highlighted: boolean,
    price: number,
    units: number,
    maxUnits: number,
    order: number,
    image?: string,
    id?: string,
    timestamp?: number
  ): CCartProductOption {
    return this.createInitObject(arguments, [
      'name',
      'highlighted',
      'price',
      'units',
      'maxUnits',
      'order',
      'image',
      'id',
      'timestamp'
    ])
  }
}
