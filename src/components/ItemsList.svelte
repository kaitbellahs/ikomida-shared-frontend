<script lang="ts">
  import Item from './Item.svelte'
  import FloatRemove from './FloatRemove.svelte'
  import FloatEdit from './FloatEdit.svelte'
  import ShiftUpDownButtons from './ShiftUpDownButtons.svelte'
  import Navigation from '../Stores/Navigation'
  import type { Classes } from '@ikomida/shared-types'
  import { Layout as LayoutStore } from '../Stores'
  let Layout = LayoutStore.instance.store

  export let categoriesAndProducts: Classes.CCategoryProducts[] = []
  export let productPage: Symbol | undefined = undefined
  export let removeProduct: ((product: Classes.CProduct) => Promise<void>) | undefined = undefined
  export let removeCategory: ((id?: string) => Promise<void>) | undefined = undefined
  export let editCategory: ((category: Classes.CCategoryProducts) => void) | undefined = undefined
  export let categoryUp: ((id?: string) => void) | undefined = undefined
  export let categoryDown: ((id?: string) => void) | undefined = undefined
  export let itemUp: ((categoryId?: string, id?: string) => void) | undefined = undefined
  export let itemDown: ((categoryId?: string, id?: string) => void) | undefined = undefined

  function goToProduct(options: Classes.CProduct) {
    Navigation.instance?.goTo(productPage, options)
  }

  function onRemoveCategoryClick(id?: string) {
    removeCategory?.(id)
  }

  function onEditCategoryClick(category: Classes.CCategoryProducts) {
    editCategory?.(category)
  }

  let itemDownClick = (categoryId?: string) => {
    return (id?: string) => {
      itemDown?.(categoryId, id)
    }
  }

  let itemUpClick = (categoryId?: string) => {
    return (id?: string) => {
      itemUp?.(categoryId, id)
    }
  }

  let categoryDownClick = (id?: string) => {
    categoryDown?.(id)
  }

  let categoryUpClick = (id?: string) => {
    categoryUp?.(id)
  }
</script>

<div
  style="--buttonBackground: {$Layout?.button?.background || 'red'};--buttonColor: {$Layout?.button?.color || '#fff'};"
>
  {#each categoriesAndProducts as category, index (category.id ?? index)}
    <h2>
      {#if removeCategory}
        <FloatRemove callback={() => onRemoveCategoryClick(category.id)} />
      {/if}
      {#if editCategory}
        <FloatEdit right={45} callback={() => onEditCategoryClick(category)} />
      {/if}
      <ShiftUpDownButtons
        hasUp={categoryUp && index > 0}
        hasDown={categoryUp && categoriesAndProducts.length - 1 > index}
        up={() => categoryUpClick(category.id)}
        down={() => categoryDownClick(category.id)}
      />
      {category.title}
    </h2>
    {#each category?.products ?? [] as product, productIndex (product?.id ?? productIndex)}
      <Item
        {product}
        {goToProduct}
        {removeProduct}
        itemUp={productIndex > 0 ? itemUpClick(category.id) : undefined}
        itemDown={(category.products?.length ?? 0) - 1 > productIndex ? itemDownClick(category.id) : undefined}
      />
    {/each}
  {/each}
</div>

<style>
  h2 {
    text-align: center;
    padding: 0;
    margin: 0;
    padding-bottom: 15px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;
    position: relative;
  }
</style>
