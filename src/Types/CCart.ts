import { Classes, Decorators, Types } from '@ikomida/shared-types'
import { FromJSON } from '@ikomida/shared-types/lib/Decorators/FromJSON'
import CCartProductOption from './CCartProductOption'

export default class CCart extends Classes.CProduct {
  @Decorators.Property.Property
  @FromJSON(CCartProductOption)
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
    options?: CCartProductOption[]
  ): CCart {
    return this.createInitObject(arguments)
  }
}
