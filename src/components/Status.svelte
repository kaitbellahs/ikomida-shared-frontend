<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import Fa from 'svelte-fa'
  import Types from '../Types/Status'
  import { faXmark, faCheck, faTriangleExclamation, faInfo } from '@fortawesome/free-solid-svg-icons'
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
  export let type = Types.INFO
  export let circle = false
  export let showIcon = true
  export let alignCenter = true
  export let icon: IconDefinition | null = null
  import { Layout as LayoutStore } from '../Stores'
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

  let style = `--color:${$Layout?.color ?? '#4c0708'};--backGroundColor:transparent;`

  $: if (type) {
    switch (type) {
      case Types.INFO:
        icon = icon ? icon : faInfo
        style = '--color:#4c0708;--backGroundColor:#fff5ca;'
        break
      case Types.SUCCESS:
        icon = icon ? icon : faCheck
        style = '--color:white;--backGroundColor:green;'
        break
      case Types.WARNING:
        icon = icon ? icon : faTriangleExclamation
        style = '--color: green;--backGroundColor: yellow;'
        break
      case Types.ERROR:
        icon = icon ? icon : faXmark
        style = '--color:white;--backGroundColor:red;'
        break
    }
    style += `${alignCenter ? 'text-align:center;' : ''}`
  }
</script>

<div {style} class:circle>
  {#if icon && showIcon}
    <Fa style="font-size: 2.5em; margin-bottom: 5px;" {icon} />
  {/if}
  <slot />
</div>

<style>
  div {
    border-radius: 6px;
    padding: 4px 20px;
    align-self: center;
    place-self: center;
    display: flex;
    flex-direction: column;
    color: var(--color);
    background-color: var(--backGroundColor);
    border: 1px solid var(--color);
    place-content: center;
    align-items: center;
  }
  div.circle {
    aspect-ratio: 1 / 0.6;
    border-top-left-radius: 100%;
    border-top-right-radius: 100%;
  }
</style>
