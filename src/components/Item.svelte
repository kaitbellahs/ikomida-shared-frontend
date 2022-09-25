<script lang="ts">
  import { currency } from '../Utils/Strings';
  import { Classes, Types } from '@ikomida/shared-types';
  import FloatRemove from './FloatRemove.svelte';
  import ShiftUpDownButtons from './ShiftUpDownButtons.svelte';
  import { Finances } from '@ikomida/shared-logics';
  import { Layout as LayoutStore } from '../Stores';
  let Layout = LayoutStore.instance.store;

  export let product: Classes.CProduct;
  export let goToProduct: ((product: Classes.CProduct) => void) | null = null;
  export let removeProduct: ((product: Classes.CProduct) => Promise<void>) | null = null;
  export let showImage = true;
  export let itemUp: ((categoryId?: string, id?: string) => void) | null = null;
  export let itemDown: ((categoryId?: string, id?: string) => void) | null = null;

  $: servesPersons = (product?.serves ?? 0) > 1 ? product?.serves + ' pessoas' : (product?.serves ?? 0) + ' pessoa';

  function onClick() {
    goToProduct?.(product);
  }

  async function onRemoveClick() {
    await removeProduct?.(product);
  }

  let itemUpClick = () => {
    itemUp?.(product?.id);
  };
  let itemDownClick = () => {
    itemDown?.(product?.id);
  };

  function erroLoadImage() {
    showImage = false;
  }
</script>

<div
  class="leftShadow item"
  style="--background: {$Layout?.background || '#eeeeee33'};--buttonBackground: {$Layout?.button?.background ||
    'red'};--buttonColor: {$Layout?.button?.color || '#fff'};"
>
  <ShiftUpDownButtons hasUp={itemUp !== null} hasDown={itemDown !== null} on:up={itemUpClick} on:down={itemDownClick} />
  {#if removeProduct}
    <FloatRemove callback={onRemoveClick} />
  {/if}
  <div on:click={onClick}>
    <h3>{product?.title}</h3>
    <div>
      {#if product?.image && showImage}
        <div class="image">
          <img on:error={erroLoadImage} src={product?.image} alt={product?.title} />
        </div>
      {/if}
      <div class="body">
        <h4>
          <span class="current"
            >{currency(
              (product?.price ?? 0) -
                Finances.calcDiscount(product?.price ?? 0, product?.discount ?? 0, product?.discountType),
            )}</span
          >
          {#if product?.discountType && [Types.TDiscount.PERCENT, Types.TDiscount.VALUE].includes(product?.discountType)}
            <span class="oldPrice">{currency(product?.price)}</span>
          {/if}
        </h4>
        <p>{product?.description}</p>
        <span class:serves={product?.serves !== null}
          >Serve até {servesPersons} (≈ {Finances.formatWeight(product?.weight ?? 0)})</span
        >
      </div>
    </div>
  </div>
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
    margin: 25px 0;
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
    padding: 10px;
    padding-right: 2px;
    background: var(--background);
    position: relative;
  }
  .item > div > h3 {
    padding: 0;
    margin: 0;
    font-size: 1.5em;
    text-align: center;
    margin-bottom: 20px;
  }
  .item > div > div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  .item > div > div > div {
    width: 100%;
    min-height: 1px;
    display: flex;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .item > div > div > .image {
    flex: 1 45%;
    width: 45%;
  }
  .item > div > div > .body {
    flex: 1 55%;
    width: 55%;
  }
  .item > div > div > .body > * {
    width: 100%;
    min-width: 100%;
  }
  .item > div > div > .body > h4 {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    font-weight: lighter;
  }
  .item > div > div > .body > h4 > .current {
    color: green;
    font-size: 1.2em;
  }
  .item > div > div > .body > h4 > .oldPrice {
    text-decoration: line-through;
    color: #717171;
    font-size: 0.9rem;
  }
  .item > div > div > .body > p {
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
  .item > div > div > .body > .serves {
    font-size: 0.8rem;
  }
  .item > div > div > .image > img {
    width: 100%;
    max-width: 100%;
    object-fit: contain;
  }
</style>
