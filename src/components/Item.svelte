<script lang="ts">
  import { currency, percent } from '../Utils/Strings'
  import { Classes, Types } from '@ikomida/shared-types'
  import FloatRemove from './FloatRemove.svelte'
  import ShiftUpDownButtons from './ShiftUpDownButtons.svelte'
  import { Finances } from '@ikomida/shared-logics'
  import { Layout as LayoutStore } from '../Stores'
  import Image from './Image.svelte'
  import Status from './Status.svelte'
  import TStatus from '../Types/Status'
  import Divider from './Divider.svelte'
  import type { Writable } from 'svelte/store'
  import Discount from './Discount.svelte'
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

  export let element: HTMLElement | undefined = undefined
  export let active = true
  export let product: Classes.CProduct
  export let goToProduct: ((options: { product: Classes.CProduct; active?: boolean }) => void) | undefined = undefined
  export let removeProduct: ((product: Classes.CProduct) => Promise<void>) | undefined = undefined
  export let itemUp: ((id?: string) => void) | undefined = undefined
  export let itemDown: ((id?: string) => void) | undefined = undefined

  $: servesPersons = (product.serves ?? 0) > 1 ? product.serves + ' pessoas' : (product.serves ?? 0) + ' pessoa'

  function onClick() {
    goToProduct?.({ product, active: active && product.active })
  }

  async function onRemoveClick() {
    await removeProduct?.(product)
  }

  let itemUpClick = () => {
    itemUp?.(product.id)
  }
  let itemDownClick = () => {
    itemDown?.(product.id)
  }
</script>

<itemContainer
  bind:this={element}
  class="leftShadow item"
  style="visibility: {$Layout?.product?.animation?.in || $Layout?.product?.animation?.out
    ? 'hidden'
    : 'visible'};--itemBackground: {$Layout?.itemBackground || '#fffffffc'};--buttonBackground: {$Layout?.button
    ?.background || '#4c0708'};--buttonColor: {$Layout?.button?.color || '#fff'};"
>
  <ShiftUpDownButtons
    hasUp={itemUp !== undefined}
    hasDown={itemDown !== undefined}
    up={itemUpClick}
    down={itemDownClick}
  />
  {#if removeProduct}
    <FloatRemove top={-8} right={-4} callback={onRemoveClick} />
  {/if}
  <button on:click={onClick}>
    {#if !removeProduct && [Types.TDiscount.PERCENT, Types.TDiscount.VALUE].includes(product.discountType)}
      <Discount value={product.discount} type={product.discountType} top={-8} right={-8} />
    {/if}
    <h3>{product.title}</h3>
    <div>
      {#if product.image}
        <div class="image">
          <Image source={product.image} name={product.title} />
        </div>
      {/if}
      <div class="body">
        <h4>
          <span class="current"
            >{currency(
              (product.price ?? 0) -
                Finances.calcDiscount(product.price ?? 0, product.discount ?? 0, product.discountType)
            )}</span
          >
          {#if product.discountType && [Types.TDiscount.PERCENT, Types.TDiscount.VALUE].includes(product.discountType)}
            <span class="oldPrice">{currency(product.price)}</span>
          {/if}
        </h4>
        <p>{product.description}</p>
        <span class:serves={product.serves !== undefined}
          >Serve até {servesPersons} (≈ {product.measureUnit && product.measure
            ? Finances.formatMeasure(product.measure ?? 0, product.measureUnit)
            : '-'})</span
        >
      </div>
    </div>
    {#if removeProduct && product.quantity <= 10}
      <Divider height={7} />
      <Status type={TStatus.WARNING}>A quantidade dos itens deste produto é inferior a 10 unidades.</Status>
    {/if}
    {#if removeProduct && product.orderTypes}
      <Divider height={7} />
      <div class="orderTypes">
        {#each product.orderTypes ?? [] as orderType}
          <span>{orderType.name}</span>
        {/each}
      </div>
    {/if}
  </button>
</itemContainer>

<style>
  *,
  *:before,
  *:after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  itemContainer {
    width: 100%;
    margin: 16px 0;
    padding: 16px;
    background: var(--itemBackground);
    position: relative;
    border-radius: 8px;
    flex-grow: 1;
    width: 100%;
  }
  itemContainer > button {
    background-color: transparent;
    border: 0;
  }
  itemContainer > button > .orderTypes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  itemContainer > button > .orderTypes > span {
    padding: 4px;
    border-radius: 8px;
    margin: 4px;
    font-size: 0.9em;
    border: var(--buttonBackground) solid 1px;
  }
  itemContainer > button > h3 {
    padding: 0;
    margin: 0;
    font-size: 1.5em;
    text-align: center;
    margin-bottom: 16px;
  }
  itemContainer > button > div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  itemContainer > button > div > div {
    width: 100%;
    min-height: 1px;
    display: flex;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  itemContainer > button > div > .image {
    flex: 1 45%;
    width: 45%;
  }
  itemContainer > button > div > .body {
    flex: 1 55%;
    width: 55%;
  }
  itemContainer > button > div > .body > * {
    width: 100%;
    min-width: 100%;
  }
  itemContainer > button > div > .body > h4 {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    font-weight: lighter;
  }
  itemContainer > button > div > .body > h4 > .current {
    color: green;
    font-size: 1.2em;
  }
  itemContainer > button > div > .body > h4 > .oldPrice {
    text-decoration: line-through;
    color: #717171;
    font-size: 0.9rem;
  }
  itemContainer > button > div > .body > p {
    font-size: 0.9rem;
    font-weight: lighter;
    margin: 16px 0;
    max-height: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: break-spaces;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  itemContainer > button > div > .body > .serves {
    font-size: 0.8rem;
  }
  itemContainer > button > div > .image > :global(img) {
    width: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  @media (min-width: 481px) {
    itemContainer {
      flex-grow: 1;
      width: calc(50% - 32px);
      max-width: calc(50% - 16px);
      margin: 16px 8px;
    }
  }
</style>
