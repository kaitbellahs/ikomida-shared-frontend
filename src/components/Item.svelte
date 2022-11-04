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
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

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

<div
  class="leftShadow item"
  style="--itemBackground: {$Layout?.itemBackground || '#ffffffab'};--buttonBackground: {$Layout?.button?.background ||
    '#4c0708'};--buttonColor: {$Layout?.button?.color || '#fff'};"
>
  <ShiftUpDownButtons
    hasUp={itemUp !== undefined}
    hasDown={itemDown !== undefined}
    up={itemUpClick}
    down={itemDownClick}
  />
  {#if removeProduct}
    <FloatRemove callback={onRemoveClick} />
  {/if}
  <button on:click={onClick}>
    {#if !removeProduct && [Types.TDiscount.PERCENT, Types.TDiscount.VALUE].includes(product.discountType)}
      <span class="discount"
        >-{Types.TDiscount.VALUE === product.discountType
          ? currency(product.discount)
          : percent(product.discount)}</span
      >
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
</div>

<style>
  *,
  *:before,
  *:after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .item {
    width: 100%;
    margin: 15px 0;
    border: 1px solid #ccc;
    padding: 10px;
    background: var(--itemBackground);
    position: relative;
    border-radius: 10px;
  }
  .item > button {
    background-color: transparent;
    border: 0;
  }
  .item > button > .orderTypes {
    display: flex;
    flex-direction: row;
  }
  .item > button > .orderTypes > span {
    padding: 2px;
    border-radius: 5px;
    margin: 5px;
    font-size: 0.9em;
    border: var(--buttonBackground) solid 1px;
  }
  .item > button > .discount {
    position: absolute;
    top: -5px;
    right: -5px;
    border-radius: 20.5px;
    min-width: 60px;
    border: 1px solid #4c0708;
    background: #4c0708;
    color: white;
    line-height: 21px;
    padding: 0px 8px;
    text-shadow: 0.5px 1px #00000055;
    box-shadow: 2px 3px #00000099;
  }
  .item > button > h3 {
    padding: 0;
    margin: 0;
    font-size: 1.5em;
    text-align: center;
    margin-bottom: 20px;
  }
  .item > button > div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  .item > button > div > div {
    width: 100%;
    min-height: 1px;
    display: flex;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .item > button > div > .image {
    flex: 1 45%;
    width: 45%;
  }
  .item > button > div > .body {
    flex: 1 55%;
    width: 55%;
  }
  .item > button > div > .body > * {
    width: 100%;
    min-width: 100%;
  }
  .item > button > div > .body > h4 {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    font-weight: lighter;
  }
  .item > button > div > .body > h4 > .current {
    color: green;
    font-size: 1.2em;
  }
  .item > button > div > .body > h4 > .oldPrice {
    text-decoration: line-through;
    color: #717171;
    font-size: 0.9rem;
  }
  .item > button > div > .body > p {
    font-size: 0.9rem;
    font-weight: lighter;
    margin: 10px 0;
    max-height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: break-spaces;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .item > button > div > .body > .serves {
    font-size: 0.8rem;
  }
  .item > button > div > .image > :global(img) {
    width: 100%;
    max-width: 100%;
    object-fit: contain;
  }
</style>
