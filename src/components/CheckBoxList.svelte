<script lang="ts">
  import { Classes, Types } from '@ikomida/shared-types'
  import Checkbox from './Checkbox.svelte'
  import type { ISelectorOptions, ITitlesBaseJSON } from '../Types/SelectorOptions'
  type SelectorType = ISelectorOptions | Types.TBaseType | (Classes.BaseJSON & ITitlesBaseJSON)

  export let title: string
  export let marginTop = 0
  export let selected: SelectorType[] | undefined = []
  export let options: SelectorType[] = []

  $: getText = (option: SelectorType) => {
    if (option instanceof Classes.BaseJSON && 'title' in option) {
      return option.title ?? '-'
    } else if (option instanceof Types.TBaseType) {
      return option.description ?? option.name ?? '-'
    }
    return '-'
  }
</script>

<h3>{title}</h3>
<div class="shadow options">
  {#each options as option (option?.id)}
    <div class="option">
      <Checkbox
        {marginTop}
        checked={selected?.includes(option)}
        on:check={event => {
          if (!selected || selected === undefined) {
            selected = []
          }
          const index = selected?.indexOf(option)
          if ((index ?? -1) > -1) {
            selected?.splice(index, 1)
          }
          if (event.detail.checked) {
            selected?.push(option)
          }
          selected = selected
        }}
        label={getText(option)}
      />
    </div>
  {/each}
</div>

<style>
  .options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .options > .option {
    flex: 1;
    padding: 4px;
    border-radius: 4px;
    margin: 8px;
    width: 50%;
    display: flex;
    flex-direction: column;
    flex-basis: 40%;
    text-shadow: 0.8px 1px #18056b66;
    box-shadow: 0 4px 8px #0000009e;
  }
</style>
