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
  export let margin = '8px'
  export let padding = 8
  export let route: Symbol | undefined = undefined

  const dispatch = createEventDispatcher()

  let border = ''
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store
  let navigation: Navigation = Navigation.instance
  let width = 'none'
  let background = $Layout?.button?.background ?? '#4c0708'
  let color = $Layout?.button?.color ?? '#ffffff'
  let minHeight = `min-height: calc(${height ? height : 48}px * ${sizeMultiplier});`

  $: float = isFloat
    ? `z-index: 999;border-radius:8px;position: fixed; left: 8px; right: 8px; bottom: ${(bottomPadding ?? 0) + 56}px;`
    : ''

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
      background = 'transparent'
      color = $Layout?.button?.background ?? '#4c0708'
      border = `1px solid ${$Layout?.button?.background ?? '#4c0708'}`
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
  style="--padding:{padding}px;--border: {border};--margin:{margin};--height:{height
    ? height
    : '48px'};--leftPadding: {leftPadding}px; --rightPadding: {rightPadding}px; text-transform: {upperCased
    ? 'uppercase'
    : 'full-width'}; --multiplier: {sizeMultiplier};--background:{background};--color:{color};--width:{width};{minHeight}{float};--disabledBackground:{type ===
  TButton.TRANSPARENT
    ? 'transparent'
    : '#585757'};--disabledColor:{type === TButton.TRANSPARENT ? '#ccc' : '#000'};"
  class={type !== TButton.TRANSPARENT ? 'leftShadow' : 'transparent'}
  on:click={click}><slot /></button
>

<style>
  button {
    margin: var(--margin);
    padding: var(--padding);
    margin-left: var(--leftPadding);
    margin-right: var(--rightPadding);
    color: var(--color);
    width: var(--width);
    background: var(--background);
    border-radius: calc(var(--height) / 2);
    border: var(--border);
    box-shadow: 0 4px 8px #0000009e;
  }
  button:disabled {
    background: var(--disabledBackground);
    border: 0;
    color: var(--disabledColor);
  }
  button.transparent {
    text-shadow: none;
    border: 0;
    box-shadow: none;
  }
</style>
