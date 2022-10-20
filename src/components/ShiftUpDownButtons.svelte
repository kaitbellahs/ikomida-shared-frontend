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
    background-color: transparent;
  }
  shiftUpDownButtons {
    display: flex;
    flex-direction: column;
    width: 18px;
    overflow: hidden;
    font-size: 18px;
  }
  shiftUpDownButtons > button {
    margin: 0;
    padding: 0;
    height: 18px;
    overflow: hidden;
    display: flex;
    align-items: center;
    place-content: center;
    border: 1px solid #4c0708;
    box-shadow: 1px 2px #ccc;
    border-radius: 9px;
  }
  shiftUpDownButtons > button.up {
    align-items: flex-start;
    place-content: center;
    padding-top: 3px;
  }
  shiftUpDownButtons > button.down {
    margin-top: 2px;
    align-items: flex-end;
    place-content: center;
    padding-bottom: 3px;
  }
</style>
