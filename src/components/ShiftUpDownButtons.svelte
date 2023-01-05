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
    <button class="shadow up" on:click={up}>
      <Fa style="font-size: 1em; color: #350101;" icon={faSortUp} />
    </button>
  {/if}
  {#if hasDown}
    <button class="shadow down" on:click={down}>
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
    font-size: 24px;
    width: 24px;
    position: absolute;
    top: -8px;
    left: -4px;
  }
  shiftUpDownButtons > button {
    margin: 0;
    padding: 0;
    height: 24px;
    overflow: hidden;
    display: flex;
    align-items: center;
    place-content: center;
    border: 1px solid #4c0708;
    border-radius: 12px;
  }
  shiftUpDownButtons > button.up {
    align-items: flex-start;
    place-content: center;
    padding-top: 4px;
  }
  shiftUpDownButtons > button.down {
    margin-top: 4px;
    align-items: flex-end;
    place-content: center;
    padding-bottom: 4px;
  }
</style>
