<script lang="ts">
  import type { Classes, Types } from '@ikomida/shared-types'
  import type { ISelectorOptions } from '../Types/SelectorOptions'

  type SelectorType = ISelectorOptions | Classes.BaseJSON | undefined | Types.TBaseType
  export let name: string
  export let marginTop = 20
  export let selected: SelectorType
  export let options: any[] = []

  function change(option: any) {
    const currentOption = options.filter(item => item?.id === option.target.value)?.[0]
    selected = currentOption
  }
</script>

<select on:change={change} style="--marginTop:{marginTop}px;">
  {#if name}
    <option value={null}>{name}</option>
  {/if}
  {#each options as option, index (option?.id ?? index)}
    <option value={option.id} selected={selected?.id === option?.id}>{option?.name ?? option?.title ?? ''}</option>
  {/each}
</select>

<style>
  select {
    width: 100%;
    background-color: #f2f2f2;
    height: 44px;
    border-radius: 4px;
    border: 0;
    margin: 0;
    -webkit-touch-callout: all;
    -webkit-user-select: all;
    -khtml-user-select: all;
    -moz-user-select: all;
    -ms-user-select: all;
    user-select: all;
    margin-top: var(--marginTop);
  }
</style>
