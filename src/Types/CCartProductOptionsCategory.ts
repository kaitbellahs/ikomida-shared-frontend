import { Classes, Decorators } from '@ikomida/shared-types'
import { CCartProductOption } from './index.js'

export default class CCartProductOptionsCategory extends Classes.CProductOptionsCategory {
    @Decorators.Property.Property
    @Decorators.FromJSON.FromJSON(CCartProductOption)
    cartOptions!: CCartProductOption[]

    static init(
        name: string,
        highlighted: boolean,
        min: number,
        max: number,
        order: number,
        cartOptions: CCartProductOption[],
        image?: string,
        id?: string,
        timestamp?: number
    ): CCartProductOptionsCategory {
        return this.createInitObject(arguments, [
            'name',
            'highlighted',
            'min',
            'max',
            'order',
            'cartOptions',
            'image',
            'id',
            'timestamp'
        ])
    }
}
