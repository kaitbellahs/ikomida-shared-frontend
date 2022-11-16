<script lang="ts">
  import Fa from 'svelte-fa'
  import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

  export let hasUp = false
  export let hasDown = false
  export let up: () => void
  export let down: () => void
</script>

<shiftUpDownButtons>
  {#if hasUp}
    <button class="up" on:click={up}>
      <Fa style="font-size: 1em; color: #350101;" icon={faSortUp} />
    </button>
  {/if}
  {#if hasDown}
    <button class="down" on:click={down}>
      <Fa style="font-size: 1em; color:#350101;" icon={faSortDown} />
    </button>
  {/if}
</shiftUpDownButtons>

<style>
  button {
    border: 0;
    background-color: #fffffffc;
  }
  shiftUpDownButtons {
    display: flex;
    flex-direction: column;
    font-size: 24pt;
    width: 24pt;
    position: absolute;
    top: -8pt;
    left: -4pt;
  }
  shiftUpDownButtons > button {
    margin: 0;
    padding: 0;
    height: 24pt;
    overflow: hidden;
    display: flex;
    align-items: center;
    place-content: center;
    border: 1pt solid #4c0708;
    box-shadow: 0 4pt 8pt #0000009e;
    border-radius: 12pt;
  }
  shiftUpDownButtons > button.up {
    align-items: flex-start;
    place-content: center;
    padding-top: 4pt;
  }
  shiftUpDownButtons > button.down {
    margin-top: 4pt;
    align-items: flex-end;
    place-content: center;
    padding-bottom: 4pt;
  }
</style>
