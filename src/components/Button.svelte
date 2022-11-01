<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import { createEventDispatcher } from 'svelte'
  import { Layout as LayoutStore, Navigation } from '../Stores'
  import TButton from '../Types/TButton'

  export let bottomPadding = 0
  export let type = TButton.PRIMARY
  export let isFloat = false
  export let size = 'full'
  export let height = ''
  export let disabled = false
  export let sizeMultiplier = 1
  export let upperCased = true
  export let leftPadding = 0
  export let rightPadding = 0
  export let margin = '5px'
  export let route: Symbol | undefined = undefined

  const dispatch = createEventDispatcher()

  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store
  let navigation: Navigation = Navigation.instance
  let width = 'none'
  let background = $Layout?.button?.background ?? '#4c0708'
  let color = $Layout?.button?.color ?? '#ffffff'
  let minHeight = `min-height: calc(${height ? height : 40}px * ${sizeMultiplier});`

  $: float = isFloat ? `position: fixed; left: 5px; right: 5px; bottom: ${(bottomPadding ?? 0) + 52}px;` : ''

  switch (type) {
    case TButton.CONTAINER:
    case TButton.TRANSPARENT:
      background = 'transparent'
      color = $Layout?.button?.background ?? '#4c0708'
    case TButton.CONTAINER:
      minHeight = ''
      height = '100%'
      break
    case TButton.SECONDARY:
      background = 'gray'
      color = 'black'
      break
    default:
      break
  }

  switch (size) {
    case 'half':
      width = `50%`
      break
    case 'none':
      break
    default:
      width = isFloat ? 'none' : `100%`
      break
  }
  function click(event: MouseEvent) {
    if (route) {
      navigation.goTo(route)
    } else {
      dispatch('click', { event })
    }
  }
</script>

<button
  {disabled}
  style="--margin:{margin};--height:{height
    ? height
    : '40px'};--leftPadding: {leftPadding}px; --rightPadding: {rightPadding}px; text-transform: {upperCased
    ? 'uppercase'
    : 'full-width'}; --multiplier: {sizeMultiplier};--background:{background};--color:{color};--width:{width};{minHeight}{float}"
  class={type !== TButton.TRANSPARENT ? 'leftShadow' : 'transparent'}
  on:click={click}><slot /></button
>

<style>
  button {
    margin: var(--margin);
    padding: 0;
    margin-left: var(--leftPadding);
    margin-right: var(--rightPadding);
    color: var(--color);
    width: var(--width);
    background: var(--background);
    border-radius: calc(4px * var(--multiplier));
    border: 0;
    font-size: calc(var(--multiplier) * 1em);
    text-shadow: calc(var(--multiplier) * 0.5px) calc(var(--multiplier) * 1px) #18056b66;
    box-shadow: calc(var(--multiplier) * 1px) calc(var(--multiplier) * 2px) #ccc;
  }
  button:disabled {
    background: #585757;
  }
  button.transparent {
    text-shadow: none;
    box-shadow: none;
  }
</style>
