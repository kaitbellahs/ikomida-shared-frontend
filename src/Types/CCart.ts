import { Classes, Decorators, Types } from '@ikomida/shared-types'
import CCartProductOption from './CCartProductOption'

export default class CCart extends Classes.CProduct {
  @Decorators.Property.Property
  @Decorators.FromJSON.FromJSON(CCartProductOption)
  options: CCartProductOption[] = []
  @Decorators.Property.Property
  @Decorators.Nullable
  leftQuantity!: number

  static initCart(
    id: string,
    title: string,
    price: number,
    discount: number,
    discountType: Types.TDiscount,
    quantity: number,
    leftQuantity: number,
    image?: string,
    optionsCategories?: Classes.CProductOptionsCategory[],
    options?: CCartProductOption[],
    observation?: string
  ): CCart {
    return this.createInitObject(arguments, [
      'id',
      'title',
      'price',
      'discount',
      'discountType',
      'quantity',
      'leftQuantity',
      'image',
      'optionsCategories',
      'options',
      'observation'
    ])
  }
}
