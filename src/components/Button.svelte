<script lang="ts">
  import { Layout as LayoutStore } from '../Stores'
  import TButton from '../Types/TButton'
  let Layout = LayoutStore.instance.store

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

  let width = 'none'

  $: float = isFloat ? `position: fixed; left: 5px; right: 5px; bottom: ${(bottomPadding ?? 0) + 52}px;` : ''

  let background = $Layout?.button?.background ?? '#4c0708'
  let color = $Layout?.button?.color ?? '#ffffff'

  switch (type) {
    case TButton.TRANSPARENT:
      background = 'transparent'
      color = $Layout?.button?.background ?? '#4c0708'
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
</script>

<button
  {disabled}
  style="--margin:{margin};--height:{height
    ? height
    : '40px'};--leftPadding: {leftPadding}px; --rightPadding: {rightPadding}px; text-transform: {upperCased
    ? 'uppercase'
    : 'full-width'}; --multiplier: {sizeMultiplier};--background:{background};--color:{color};--width:{width};{float}"
  class={type !== TButton.TRANSPARENT ? 'leftShadow' : 'transparent'}
  on:click><slot /></button
>

<style>
  button {
    margin: var(--margin);
    padding: 0;
    margin-left: var(--leftPadding);
    margin-right: var(--rightPadding);
    min-height: calc(var(--height) * var(--multiplier));
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
