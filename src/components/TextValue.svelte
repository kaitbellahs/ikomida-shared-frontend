<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import { Layout as LayoutStore } from '../Stores'
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

  export let text = ''
  export let value = ''
  export let fontSize = '1em'
  export let leftMargin = 40
  export let leftColor: string | null = null
  export let rightColor: string | null = null
</script>

<div
  class="TextValue"
  style="--fontSize: {fontSize}; --leftMargin: {leftMargin}%;--leftColor:{leftColor ??
    $Layout?.color ??
    '#000000'};--rightColor:{rightColor ?? $Layout?.color ?? '#000000'};"
>
  <div class="text">{text}</div>
  <div class="value">{value}</div>
</div>

<style>
  .TextValue {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: var(--fontSize);
    place-content: center;
  }
  .TextValue > .text {
    width: var(--leftMargin);
    font-family: RobotoMedium;
    text-align: right;
    color: var(--leftColor);
  }
  .TextValue > .value {
    margin-left: 16px;
    width: calc(100% - var(--leftMargin));
    color: var(--rightColor);
  }
</style>
