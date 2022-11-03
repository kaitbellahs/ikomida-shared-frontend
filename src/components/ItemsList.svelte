<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import Item from './Item.svelte'
  import FloatRemove from './FloatRemove.svelte'
  import FloatEdit from './FloatEdit.svelte'
  import ShiftUpDownButtons from './ShiftUpDownButtons.svelte'
  import Navigation from '../Stores/Navigation'
  import { Layout as LayoutStore } from '../Stores'
  import { DateTime } from '@ikomida/shared-logics'
  import Status from './Status.svelte'
  import { Types } from '..'
  import Divider from './Divider.svelte'
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

  export let categoriesAndProducts: Classes.CCategoryProducts[] = []
  export let productPage: Symbol | undefined = undefined
  export let removeProduct: ((product: Classes.CProduct) => Promise<void>) | undefined = undefined
  export let removeCategory: ((id?: string) => Promise<void>) | undefined = undefined
  export let editCategory: ((category: Classes.CCategoryProducts) => void) | undefined = undefined
  export let categoryUp: ((id?: string) => void) | undefined = undefined
  export let categoryDown: ((id?: string) => void) | undefined = undefined
  export let itemUp: ((categoryId?: string, id?: string) => void) | undefined = undefined
  export let itemDown: ((categoryId?: string, id?: string) => void) | undefined = undefined

  const days = [
    { name: 'Domingo', checked: false },
    { name: 'Segunda-feira', checked: false },
    { name: 'Terça-feira', checked: false },
    { name: 'Quarta-feira', checked: false },
    { name: 'Quinta-feira', checked: false },
    { name: 'Sexta-feira', checked: false },
    { name: 'Sabado', checked: false }
  ]

  function isBusinessTime(business?: Classes.CBusinessTime) {
    return !business || (!business.days && !business.hours) || DateTime.isBusinessTime(business!)
  }

  function numerToTime(object: string) {
    return `${object?.substring(0, 2)}h${object?.substring(2, 4)}`
  }

  function goToProduct(options: { product: Classes.CProduct; active?: boolean }) {
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
  style="--borderColor:{$Layout?.button?.background ?? '#4c0708'};--buttonBackground: {$Layout?.button?.background ||
    'red'};--buttonColor: {$Layout?.button?.color || '#fff'};"
>
  {#each categoriesAndProducts as category, index}
    <header>
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
      {#if category.description}
        <h4>{category.description}</h4>
      {/if}
      {#if !isBusinessTime(category.business)}
        <Status showIcon={false}
          >Esta categoria ficará disponível {#if category.business?.days?.length === 7}
            7/7
          {:else}
            {(category.business?.days ?? []).length > 1 ? 'dias' : ''}
            {#each category.business?.days ?? [] as day}
              {days?.[day]?.name || '-'} ,
            {/each}
          {/if}

          {#if (category.business?.hours?.filter(item => {
            return item.start === '0000' && item.end === '2359'
          }).length ?? 0) > 0}
            <span>24h/dia</span>
          {:else}
            nestes horários:
            {#each category.business?.hours ?? [] as businessHour}
              das {numerToTime(businessHour?.start ?? '')} até {numerToTime(businessHour?.end ?? '')},
            {/each}
          {/if}</Status
        >
      {/if}
    </header>
    {#if (category?.products ?? []).length > 0}
      {#each category?.products ?? [] as product, productIndex}
        <Item
          active={isBusinessTime(category.business)}
          {product}
          {goToProduct}
          {removeProduct}
          itemUp={itemUp && productIndex > 0 ? itemUpClick(category.id) : undefined}
          itemDown={itemDown && (category.products?.length ?? 0) - 1 > productIndex
            ? itemDownClick(category.id)
            : undefined}
        />
      {/each}
    {:else if removeCategory}
      <Status showIcon={false} type={Types.Status.WARNING}>Não há produtos nesta categoria.</Status>
      <Divider />
    {/if}
  {/each}
</div>

<style>
  header {
    text-align: center;
    padding: 0;
    margin: 0;
    margin-bottom: 15px;
    position: relative;
    background: #fff;
    border: 1px solid var(--borderColor);
    border-radius: 5px;
    padding: 5px;
  }
  header > h2 {
    text-align: center;
    padding: 0;
    margin: 0;
  }
</style>
