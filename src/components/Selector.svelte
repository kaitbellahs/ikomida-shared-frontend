<script lang="ts">
  import { Classes, Types } from '@ikomida/shared-types'
  import type { ISelectorOptions } from '../Types/SelectorOptions'
  interface ITitlesBaseJSON {
    title: string
  }
  type SelectorType = ISelectorOptions | Types.TBaseType | (Classes.BaseJSON & ITitlesBaseJSON)
  export let name: string
  export let marginTop = 20
  export let selected: SelectorType | undefined
  export let options: SelectorType[] = []

  $: getText = (option: SelectorType) => {
    if (option instanceof Classes.BaseJSON && 'title' in option) {
      return option.title ?? '-'
    } else if (option instanceof Types.TBaseType) {
      return option.description ?? option.name ?? '-'
    }
    return '-'
  }
  function change(option: any) {
    const currentOption = options.filter(item => item?.id === option.target.value)?.[0]
    selected = currentOption
  }
</script>

<select on:change={change} style="--marginTop:{marginTop}px;">
  {#if name}
    <option value={null}>{name}</option>
  {/if}
  {#each options as option, index (option.id ?? index)}
    <option value={option.id} selected={selected && selected.id === option.id}>{getText(option)}</option>
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
