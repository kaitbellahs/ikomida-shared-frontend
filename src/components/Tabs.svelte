<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  import Navigation from '../Stores/Navigation'
  import { Layout as LayoutStore, Loading, MessageAlert } from '../Stores'
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

  export let tabs: { name: string; route: Symbol; icon?: IconDefinition }[]
  export let bottomPadding = 0
  let navigation: Navigation = Navigation.instance
  let stack = navigation?.store
  let router = navigation.router

  $: baseRoute = $stack?.[0].route
  $: size = Math.round(100 / tabs.length) + '%'

  function onClick(route: Symbol) {
    if (($stack?.length ?? 0) > 1 || $router?.route !== route) {
      Loading.instance.reset()
      Navigation.instance.reset(route)
    }
    MessageAlert.instance.reset()
  }
</script>

<footer
  style="--size:{size};--bottomPadding:{bottomPadding}px;--background:{$Layout?.tabs?.background ??
    '#ffe4c4'};--color:{$Layout?.tabs?.color || '#4c0708'};"
>
  {#each tabs as { name, route, icon } (name)}
    <button aria-label={name} class:selected={baseRoute === route} on:click={() => onClick(route)}>
      {#if icon}
        <Fa {icon} style="vertical-align: middle;align-self: center;" />
      {/if}
      <span class="center">{name}</span>
    </button>
  {/each}
</footer>

<style>
  footer {
    position: fixed;
    left: 16pt;
    right: 16pt;
    bottom: calc(16pt + var(--bottomPadding));
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: stretch;
    background: var(--background);
    z-index: 99999999;
    padding: 0;
    border-radius: 8pt;
    box-shadow: 0 4pt 8pt #0000009e;
    border: 1pt solid #fff;
    overflow: hidden;
  }
  footer > button {
    border: 0;
    background: transparent;
    display: flex;
    flex: 1 var(--size);
    align-self: center;
    margin: 0;
    height: 48pt;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 0;
    color: var(--color);
  }

  footer > button:not(:first-child) {
    border-left: 1pt solid rgb(0 0 0 / 20%);
  }

  footer > button > * {
    vertical-align: middle;
    align-self: center;
  }

  footer > .selected {
    background-color: var(--color);
    border-radius: 0;
    color: var(--background);
  }
</style>
