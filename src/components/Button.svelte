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
  export let margin = '8pt'
  export let padding = 8
  export let route: Symbol | undefined = undefined

  const dispatch = createEventDispatcher()

  let border = ''
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store
  let navigation: Navigation = Navigation.instance
  let width = 'none'
  let background = $Layout?.button?.background ?? '#4c0708'
  let color = $Layout?.button?.color ?? '#ffffff'
  let minHeight = `min-height: calc(${height ? height : 48}pt * ${sizeMultiplier});`

  $: float = isFloat
    ? `border-radius:8pt;position: fixed; left: 8pt; right: 8pt; bottom: ${(bottomPadding ?? 0) + 56}pt;`
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
      border = `1pt solid ${$Layout?.button?.background ?? '#4c0708'}`
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
  style="--padding:{padding}pt;--border: {border};--margin:{margin};--height:{height
    ? height
    : '48pt'};--leftPadding: {leftPadding}pt; --rightPadding: {rightPadding}pt; text-transform: {upperCased
    ? 'uppercase'
    : 'full-width'}; --multiplier: {sizeMultiplier};--background:{background};--color:{color};--width:{width};{minHeight}{float}"
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
    /* font-size: calc(var(--multiplier)); */
    box-shadow: 0 4pt 8pt #0000009e;
  }
  button:disabled {
    /* border-radius: calc(4pt * var(--multiplier)); */
    background: #585757;
    border: 0;
    color: black;
  }
  button.transparent {
    /* border-radius: calc(4pt * var(--multiplier)); */
    text-shadow: none;
    border: 0;
    box-shadow: none;
  }
</style>
