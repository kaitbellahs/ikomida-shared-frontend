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
  export let productPage: Symbol | null = null
  export let removeProduct: ((product: Classes.CProduct) => Promise<void>) | null = null
  export let removeCategory: ((id?: string) => Promise<void>) | null = null
  export let editCategory: ((category: Classes.CCategoryProducts) => void) | null = null
  export let categoryUp: ((id?: string) => void) | null = null
  export let categoryDown: ((id?: string) => void) | null = null
  export let itemUp: ((categoryId?: string, id?: string) => void) | null = null
  export let itemDown: ((categoryId?: string, id?: string) => void) | null = null

  function goToProduct(options: Classes.CProduct) {
    Navigation.instance?.goTo(productPage, options)
  }

  function onRemoveCategoryClick(id?: string) {
    removeCategory?.(id)
  }

  function onEditCategoryClick(category: Classes.CCategoryProducts) {
    editCategory?.(category)
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
        hasUp={index > 0}
        hasDown={categoriesAndProducts.length - 1 > index}
        on:up={() => categoryUpClick(category.id)}
        on:down={() => categoryDownClick(category.id)}
      />
      {category.title}
    </h2>
    {#each category?.products ?? [] as product, productIndex (product?.id ?? productIndex)}
      <Item
        {product}
        {goToProduct}
        {removeProduct}
        itemUp={productIndex > 0 ? itemUp : null}
        itemDown={(category.products?.length ?? 0) - 1 > productIndex ? itemDown : null}
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
