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
  import { CCartProductOption, TButton, TTextEdit } from '../Types'
  import TextEdit from './TextEdit.svelte'

  type ICallback =
    | ((cartProduct?: CCart, option?: CCartProductOption) => void)
    | ((cartProduct?: CCart, option?: CCartProductOption) => Promise<void>)
    | null

  export let cartProduct: CCart
  export let onRemoveClick: ICallback = null
  export let onPlusClick: ICallback = null
  export let onMinosClick: ICallback = null
  export let addOptions: ICallback = null

  $: options = cartProduct?.cartOptionsCategories?.flatMap(optionsCategory => optionsCategory.cartOptions)
  $: optionsTotal = () => {
    let calcTotal = 0
    for (const option of options ?? []) {
      calcTotal +=
        option.units *
        (option.price - Finances.calcDiscount(option.price, cartProduct.discount, cartProduct.discountType))
    }
    return calcTotal
  }

  function minos(option?: CCartProductOption) {
    if (cartProduct.quantity > 1 || option) {
      onMinosClick?.(cartProduct, option)
    } else {
      onRemoveClick?.(cartProduct, option)
    }
  }

  function plus(option?: CCartProductOption) {
    onPlusClick?.(cartProduct, option)
  }
</script>

<div class="cartProduct">
  <FloatRemove callback={() => onRemoveClick?.(cartProduct)} top={-6} right={-6} />
  <h3>{cartProduct.title}</h3>
  <div>
    {#if cartProduct.image}
      <div class="image">
        <Image source={cartProduct.image} name={cartProduct.title} />
      </div>
    {/if}
    <div class="body">
      <h4>
        <span
          >{cartProduct.quantity} x {currency(
            cartProduct.price - Finances.calcDiscount(cartProduct.price, cartProduct.discount, cartProduct.discountType)
          )}</span
        >
      </h4>

      <div class="quantity">
        <Button type={TButton.TRANSPARENT} size="none" on:click={() => minos()}>
          <Fa icon={faMinusSquare} />
        </Button>
        <span>{cartProduct.quantity}</span>
        <Button type={TButton.TRANSPARENT} size="none" on:click={() => plus()}><Fa icon={faPlusSquare} /></Button>
      </div>
      <h3>
        {currency(
          optionsTotal() +
            cartProduct.quantity *
              (cartProduct.price -
                Finances.calcDiscount(cartProduct.price, cartProduct.discount, cartProduct.discountType))
        )}
      </h3>
    </div>
  </div>
  {#if (options?.length ?? 0) > 0}
    <h3>Personalização</h3>
    {#each options ?? [] as option (option.id)}
      <Divider />
      <div class="option">
        <FloatRemove callback={() => onRemoveClick?.(cartProduct, option)} top={-6} right={-6} />
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
                  cartProduct.quantity *
                    option.units *
                    (option.price - Finances.calcDiscount(option.price, cartProduct.discount, cartProduct.discountType))
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
  <Button type={TButton.TRANSPARENT} on:click={() => addOptions?.(cartProduct)} sizeMultiplier={0.7}
    >Editar as opções</Button
  >
  <TextEdit
    type={TTextEdit.TEXT}
    placeHolder="Observação"
    bind:initialValue={cartProduct.observation}
    bind:value={cartProduct.observation}
    max={255}
  />
</div>

<style>
  *,
  *:before,
  *:after {
    padding: 0;
    margin: 0;
  }
  .cartProduct {
    position: relative;
    width: 100%;
    margin-top: 20px;
    background-color: #d6d6d657;
    border: #ccd;
    border-radius: 5px;
    padding: 10px;
    padding-bottom: 0;
  }
  .cartProduct > h3 {
    padding: 0;
    margin: 0;
  }
  .cartProduct > div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  .cartProduct > div > div {
    width: 100%;
    min-height: 1px;
    display: flex;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .cartProduct > div > .image {
    flex: 1 45%;
    width: 45%;
    max-width: 45%;
  }
  .cartProduct > div > .body {
    flex: 1 55%;
    width: 55%;
    max-width: 55%;
  }
  .cartProduct > div > .body > * {
    width: 100%;
    min-width: 100%;
  }
  .cartProduct > div > .body > h4 {
    margin-top: 8px;
    font-weight: lighter;
  }
  .cartProduct > div > .image > :global(img) {
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
  .cartProduct > .option {
    background-color: #d6d6d657;
    border: #ccd;
    border-radius: 5px;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: row;
  }
  .cartProduct > .option > div {
    width: calc(100% - 42px);
    margin-left: 10px;
  }
  .cartProduct > .option > div > div {
    display: flex;
    flex-direction: row;
  }
  .cartProduct > .option > div > div > * {
    font-size: 0.9em;
  }
  .cartProduct > .option > div > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .cartProduct > .option > div > div > .units {
    margin-top: 5px;
    align-items: center;
    font-size: 0.9em;
    text-align: center;
    display: flex;
    flex-direction: row;
  }
  .cartProduct > .option > div > div > .units > span {
    padding: 0;
    border: 0;
    background: transparent;
    margin-right: 6px;
    margin-left: 6px;
  }
  .cartProduct > .option > div > div > .price {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
