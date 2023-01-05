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
  import { days } from '../Utils/Strings'
  import 'animate.css'

  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance?.store

  export let categoriesAndProducts: Classes.CCategoryProducts[] = []
  export let productPage: Symbol | undefined = undefined
  export let contract: Classes.CContract | undefined = undefined
  export let removeProduct: ((product: Classes.CProduct) => Promise<void>) | undefined = undefined
  export let removeCategory: ((id?: string) => Promise<void>) | undefined = undefined
  export let editCategory: ((category: Classes.CCategoryProducts) => void) | undefined = undefined
  export let categoryUp: ((id?: string) => void) | undefined = undefined
  export let categoryDown: ((id?: string) => void) | undefined = undefined
  export let itemUp: ((categoryId?: string, id?: string) => void) | undefined = undefined
  export let itemDown: ((categoryId?: string, id?: string) => void) | undefined = undefined
  export let itemsList: HTMLDivElement[] = []

  function isBusinessTime(business?: Classes.CBusinessTime[]) {
    return !business || DateTime.isBusinessTime(business!)
  }

  function numerToTime(object: string) {
    return `${object?.substring(0, 2)}h${object?.substring(2, 4)}`
  }

  function goToProduct(options: { product: Classes.CProduct; active?: boolean; contract?: Classes.CContract }) {
    if (contract) {
      options.contract = contract
    }
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
  let index = -1
  function getIndex() {
    index++
    return index
  }
</script>

<div
  style="--borderColor:{$Layout?.button?.background ?? '#4c0708'};--buttonBackground: {$Layout?.button?.background ||
    'red'};--buttonColor: {$Layout?.button?.color || '#fff'};"
>
  {#each categoriesAndProducts as category, index}
    <header id={category.id} class="shadow">
      <h2>
        {#if removeCategory}
          <FloatRemove top={-8} right={-4} callback={() => onRemoveCategoryClick(category.id)} />
        {/if}
        {#if editCategory}
          <FloatEdit top={-8} right={38} callback={() => onEditCategoryClick(category)} />
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
      {#if removeCategory || (category.business && category.business.length > 0 && !isBusinessTime(category.business))}
        <Status showIcon={false}
          >Esta categoria está disponível
          {#if !category.business || category.business?.filter(businessDay => (businessDay?.hours?.length ?? 0) > 0)?.length === 7 || category.business?.length === 0}
            <b>7/7</b>
          {/if}

          {#if category.business?.length === 0 || category.business?.filter(businessDay => (businessDay?.hours?.filter( item => {
                    return (item.start === '0000' && item.end === '2359') || (item.start === '00:00' && item.end === '23:59')
                  } ).length ?? 0) > 0)?.length === 7}
            <b>24h/dia</b>
          {:else}
            nestes horários:
            {#each (Array.isArray(category.business) ? category.business : [category.business]) ?? [] as businessDay}
              {#if (businessDay?.hours?.length ?? 0) > 0}
                <!-- svelte-ignore component-name-lowercase -->
                <days>
                  <day
                    ><span>{days?.[businessDay?.day ?? -1] || '-'}</span>:
                    {#each businessDay?.hours ?? [] as businessHour, index}
                      {#if businessHour.start === '0000' && businessHour.end === '2359'}
                        <span>24h/dia</span>
                      {:else}
                        {index > 0 && (businessDay?.hours?.length ?? 0) > index + 1
                          ? ', '
                          : index > 0 && index === (businessDay?.hours?.length ?? 0) - 1
                          ? ' e '
                          : ''} entre <span>{numerToTime(businessHour?.start ?? '')}</span> e
                        <span>{numerToTime(businessHour?.end ?? '')}</span>{index ===
                        (businessDay?.hours?.length ?? 0) - 1
                          ? '.'
                          : ''}
                      {/if}
                    {/each}
                  </day>
                </days>
              {/if}
            {/each}
          {/if}
        </Status>
      {/if}
    </header>
    {#if (category?.products ?? []).length > 0}
      {#each category?.products ?? [] as product, productIndex}
        <Item
          bind:element={itemsList[getIndex()]}
          active={category.business?.length === 0 || isBusinessTime(category.business)}
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
    margin-bottom: 18pt;
    position: relative;
    background: #fff;
    border: 1pt solid var(--borderColor);
    border-radius: 8pt;
    padding: 8pt;
  }
  header > h2 {
    text-align: center;
    padding: 0;
    margin: 0;
  }
  days {
    display: flex;
    flex-direction: column;
  }
  days > day > span {
    font-family: 'RobotoBold', 'Courier New', Courier, monospace;
  }
</style>
