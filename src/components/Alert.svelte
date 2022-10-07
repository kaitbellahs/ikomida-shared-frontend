<script lang="ts" context="module">
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
  export interface IAlertButton {
    name: string
    callback?: (() => void) | (() => Promise<void>) | null
    principal?: boolean
    disabled?: boolean
    icon?: IconDefinition
  }
</script>

<script lang="ts">
  import Fa from 'svelte-fa'
  import Button from './Button.svelte'
  import { Layout as LayoutStore } from '../Stores'
  import { TButton } from '../Types'
  let Layout = LayoutStore.instance.store

  export let title: string
  export let message: string | null = null
  export let buttons: IAlertButton[] = []
  export let closeCallBack: null | (() => void) | (() => Promise<void>) = null
  export let type = 'medium'
  let height = '40%'
  const handle_keydown = (e: any) => {
    if (e.key === 'Escape') {
      closeCallBack?.()
      return
    }
  }
  $: switch (type) {
    case 'small':
      height = '20%'
      break
    case 'big':
      height = '80%'
      break
    default:
      break
  }
</script>

<svelte:window on:keydown={handle_keydown} />
<div
  class="alert"
  on:click|self={closeCallBack}
  style="--height: {height};--dialogBackground:{$Layout?.dialog?.background || '#ffffffdf'};--dialogColor:{$Layout
    ?.dialog?.color || '#000'};"
>
  <div>
    <header>
      <h2>{title}</h2>
    </header>
    {#if message}
      <p>{message}</p>
    {:else}
      <section>
        <slot />
      </section>
    {/if}
    <footer>
      {#each buttons as { name, icon, callback, principal, disabled }, index (name)}
        <Button
          size="half"
          type={principal ? TButton.PRIMARY : TButton.SECONDARY}
          on:click={() => callback?.()}
          {disabled}
          leftPadding={index !== 0 ? 2 : 0}
          rightPadding={index < (buttons?.length ?? 0) - 1 ? 2 : 0}
        >
          {#if icon != undefined}
            <Fa style="font-size: 1.7em;" {icon} />
          {/if}
          {name}
        </Button>
      {/each}
    </footer>
  </div>
</div>

<style>
  section,
  p {
    max-width: 100%;
    max-height: 100%;
    overflow: scroll;
  }
  div > div > header {
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  div > div > header > h2 {
    margin: 0;
    text-align: center;
  }
  div > div > footer {
    width: calc(100% - 40px);
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  div > div > p {
    margin-top: 20px;
  }
  .alert {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000000cc;
    z-index: 9999;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    place-content: center;
    place-items: center;
    padding: 20px;
  }
  .alert > div {
    background: var(--dialogBackground);
    padding: 20px;
    color: var(--dialogColor);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    max-height: calc(100% - 100px);
    overflow: hidden;
  }
</style>
