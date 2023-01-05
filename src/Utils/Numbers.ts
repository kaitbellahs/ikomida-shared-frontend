import { Finances } from "@ikomida/shared-logics"
import type CCart from "../Types/CCart"

export function calcProductPrice(product: CCart) {
    let calcTotal = 0
    for (const option of product.options ?? []) {
        calcTotal += product.quantity * option.units * option.price
    }
    return (
        product.quantity *
        (calcTotal +
            product?.price -
            Finances.calcDiscount(calcTotal + product?.price, product.discount, product.discountType))
    )
}