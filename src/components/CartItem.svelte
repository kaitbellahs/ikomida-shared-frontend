<script lang="ts">
  import { currency } from '../Utils/Strings';
  import Fa from 'svelte-fa';
  import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
  import Button from './Button.svelte';
  import FloatRemove from './FloatRemove.svelte';
  import { Finances } from '@ikomida/shared-logics';
  import type CCart from '../Types/CCart';

  type ICallback = ((id?: string) => void) | ((id?: string) => Promise<void>) | null;

  export let product: CCart;
  export let onRemoveClick: ICallback = null;
  export let onPlusClick: ICallback = null;
  export let onMinosClick: ICallback = null;

  let showImage = true;

  function dontShowImage() {
    showImage = false;
  }

  function minos() {
    if (product.quantity > 1) {
      onMinosClick?.(product.id);
    } else {
      onRemoveClick?.(product.id);
    }
  }

  function plus() {
    onPlusClick?.(product.id);
  }
</script>

<div class="product">
  <FloatRemove callback={() => onRemoveClick?.(product.id)} />
  <h3>{product.title}</h3>
  <div>
    {#if product.image && showImage}
      <div class="image">
        <img on:error={dontShowImage} src={product.image} alt={product.title} />
      </div>
    {/if}
    <div class="body">
      <h4>
        <span
          >{product.quantity} x {currency(
            product.price - Finances.calcDiscount(product.price, product.discount, product.discountType),
          )}</span
        >
      </h4>

      <div class="quantity">
        <Button type="transparent" size="none" on:click={minos}>
          <Fa icon={faMinusSquare} />
        </Button>
        <span>{product.quantity}</span>
        <Button type="transparent" size="none" on:click={plus}><Fa icon={faPlusSquare} /></Button>
      </div>
      <h3>
        {currency(
          product.quantity *
            (product.price - Finances.calcDiscount(product.price, product.discount, product.discountType)),
        )}
      </h3>
    </div>
  </div>
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
    border-bottom: 1px solid #ccc;
    padding: 10px;
    margin-top: 30px;
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
  .product > div > .image > img {
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
</style>
