<script lang="ts">
  import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
  import { Finances } from '@ikomida/shared-logics'
  import Fa from 'svelte-fa'
  import { currency } from '../Utils/Strings'
  import Button from './Button.svelte'
  import FloatRemove from './FloatRemove.svelte'
  import type CCart from '../Types/CCart'
  import Image from './Image.svelte'
  import Divider from './Divider.svelte'
  import { CCartProductOption, Classes, TButton, TTextEdit } from '../Types'
  import TextEdit from './TextEdit.svelte'

  type ICallback =
    | ((cartProduct?: CCart, option?: CCartProductOption) => void)
    | ((cartProduct?: CCart, option?: CCartProductOption) => Promise<void>)
    | null

  export let product: CCart
  export let onRemoveClick: ICallback = null
  export let onPlusClick: ICallback = null
  export let onMinosClick: ICallback = null
  export let addOptions: ICallback = null

  $: optionsTotal = () => {
    let calcTotal = 0
    for (const option of product?.options ?? []) {
      calcTotal +=
        option.units * (option.price - Finances.calcDiscount(option.price, product.discount, product.discountType))
    }
    return calcTotal
  }

  function minos(option?: CCartProductOption) {
    if (product.quantity > 1 || option) {
      onMinosClick?.(product, option)
    } else {
      onRemoveClick?.(product, option)
    }
  }

  function plus(option?: CCartProductOption) {
    onPlusClick?.(product, option)
  }
</script>

<div class="product">
  <FloatRemove callback={() => onRemoveClick?.(product)} top={-6} right={-6} />
  <h3>{product.title}</h3>
  <div>
    {#if product.image}
      <div class="image">
        <Image source={product.image} name={product.title} />
      </div>
    {/if}
    <div class="body">
      <h4>
        <span
          >{product.quantity} x {currency(
            product.price - Finances.calcDiscount(product.price, product.discount, product.discountType)
          )}</span
        >
      </h4>

      <div class="quantity">
        <Button type={TButton.TRANSPARENT} size="none" on:click={() => minos()}>
          <Fa icon={faMinusSquare} />
        </Button>
        <span>{product.quantity}</span>
        <Button type={TButton.TRANSPARENT} size="none" on:click={() => plus()}><Fa icon={faPlusSquare} /></Button>
      </div>
      <h3>
        {currency(
          optionsTotal() +
            product.quantity *
              (product.price - Finances.calcDiscount(product.price, product.discount, product.discountType))
        )}
      </h3>
    </div>
  </div>
  {#if (product.options?.length ?? 0) > 0}
    <h3>Personalização</h3>
    {#each product.options ?? [] as option (option.id)}
      <Divider height={10} />
      <div class="option">
        <FloatRemove callback={() => onRemoveClick?.(product, option)} top={-6} right={-6} />
        <Image source={option.image} name={option.name} height="45px" width="45px" />
        <div>
          <h3>{option.name}</h3>
          <div>
            <div class="units">
              <Button
                type={TButton.TRANSPARENT}
                size="none"
                height="16px"
                sizeMultiplier={1.3}
                margin="0"
                on:click={() => minos(option)}
              >
                <Fa icon={faMinusSquare} /></Button
              ><span>{option.units}</span><Button
                type={TButton.TRANSPARENT}
                size="none"
                height="16px"
                margin="0"
                sizeMultiplier={1.3}
                on:click={() => plus(option)}><Fa icon={faPlusSquare} /></Button
              >
            </div>
            {#if option.price > 0}
              <div class="price">
                {currency(
                  product.quantity *
                    option.units *
                    (option.price - Finances.calcDiscount(option.price, product.discount, product.discountType))
                )}
              </div>
            {:else}
              <span class="current">Gratuito</span>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <Button type={TButton.TRANSPARENT} on:click={() => addOptions?.(product)} sizeMultiplier={0.7}
    >Editar as opções</Button
  >
  <TextEdit
    marginTop={5}
    type={TTextEdit.TEXT}
    placeHolder="Observação"
    bind:initialValue={product.observation}
    bind:value={product.observation}
    max={255}
  />
  <Divider height={5} />
</div>

<style>
  *,
  *:before,
  *:after {
    padding: 0;
    margin: 0;
  }
  .product {
    position: relative;
    width: 100%;
    margin-top: 20px;
    background-color: #ccccccfa;
    border: #ccd;
    border-radius: 5px;
    padding: 10px;
    padding-bottom: 0;
  }
  .product > h3 {
    padding: 0;
    margin: 0;
  }
  .product > div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  .product > div > div {
    width: 100%;
    min-height: 1px;
    display: flex;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .product > div > .image {
    flex: 1 45%;
    width: 45%;
    max-width: 45%;
  }
  .product > div > .body {
    flex: 1 55%;
    width: 55%;
    max-width: 55%;
  }
  .product > div > .body > * {
    width: 100%;
    min-width: 100%;
  }
  .product > div > .body > h4 {
    margin-top: 8px;
    font-weight: lighter;
  }
  .product > div > .image > :global(img) {
    width: 100%;
    max-width: 100%;
  }
  .quantity {
    margin-top: 10px;
    align-items: center;
    font-size: 1.8em;
    text-align: center;
    margin: 0;
    padding: 0;
    max-height: 55px;
  }
  .quantity > span {
    padding: 0;
    border: 0;
    background: transparent;
    margin-right: 10px;
    margin-left: 10px;
  }
  .product > .option {
    background-color: #ffffff26;
    border: #ccd;
    border-radius: 5px;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: row;
  }
  .product > .option > div {
    width: calc(100% - 42px);
    margin-left: 10px;
  }
  .product > .option > div > div {
    display: flex;
    flex-direction: row;
  }
  .product > .option > div > div > * {
    font-size: 0.9em;
  }
  .product > .option > div > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .product > .option > div > div > .units {
    margin-top: 5px;
    align-items: center;
    font-size: 0.9em;
    text-align: center;
    display: flex;
    flex-direction: row;
  }
  .product > .option > div > div > .units > span {
    padding: 0;
    border: 0;
    background: transparent;
    margin-right: 6px;
    margin-left: 6px;
  }
  .product > .option > div > div > .price {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
