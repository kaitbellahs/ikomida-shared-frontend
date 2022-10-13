import { Classes, Decorators, Types } from '@ikomida/shared-types'
import CCartProductOptionsCategory from './CCartProductOptionsCategory'

export default class CCart extends Classes.CProduct {
  @Decorators.Property.Property
  @Decorators.Nullable
  leftQuantity!: number
  @Decorators.Property.Property
  @Decorators.FromJSON.FromJSON(CCartProductOptionsCategory)
  @Decorators.Nullable
  cartOptionsCategories?: CCartProductOptionsCategory[]

  static initCart(
    id: string,
    title: string,
    price: number,
    discount: number,
    discountType: Types.TDiscount,
    quantity: number,
    leftQuantity: number,
    image?: string,
    cartOptionsCategories?: CCartProductOptionsCategory[],
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
      'cartOptionsCategories',
      'observation'
    ])
  }
}
