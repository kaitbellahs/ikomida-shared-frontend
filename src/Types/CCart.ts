import { Classes, Decorators, Types } from "@ikomida/shared-types"

export default class CCart extends Classes.CProduct {
    @Decorators.Property.Property
    @Decorators.Nullable
    leftQuantity!: number

    static initCart(id: string, title: string, price: number, discount: number, discountType: Types.TDiscount, quantity: number, leftQuantity: number, image?: string): CCart {
        return this.createInitObject(arguments)
    }
}