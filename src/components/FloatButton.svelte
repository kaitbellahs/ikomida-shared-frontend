<script lang="ts">
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'
  export let callback: (() => void) | null = null
  export let color: string | null = null
  export let background: string | null = null
  export let icon: IconDefinition
  export let top = 0
  export let right = 0
</script>

<div
  style="--top: {top}px; --right:{right}px;--color: {color ?? '#fff'};--background: {background ?? '#4c0708'};"
  on:click={callback}
  class="flatButton"
>
  <Fa {icon} />
</div>

<style>
  .flatButton {
    position: absolute;
    top: var(--top);
    right: var(--right);
    font-size: 1.1em;
    color: var(--color);
    font-family: RobotoBold;
    border: 1px solid #4c0708;
    box-shadow: 1px 2px #ccc;
    background-color: var(--background);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    place-content: center;
    align-items: center;
    font-size: 17px;
    z-index: 9;
  }
</style>
