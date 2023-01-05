<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { v4 as uuidV4 } from 'uuid'

  export let checked = false
  export let label: string | null = null
  export let marginTop = 20

  const dispatch = createEventDispatcher()
  const id = uuidV4()

  function onClick() {
    dispatch('check', { checked: !checked })
  }
</script>

<button class="switchContainer" style="--marginTop: {marginTop}pt;" on:click={onClick}>
  <input {id} type="checkbox" bind:checked />
  {#if label}
    <label for={id}>{label}</label>
  {/if}
</button>

<style>
  button {
    margin: 0;
    border: 0;
    background-color: transparent;
  }
  .switchContainer {
    display: flex;
    margin-top: var(--marginTop);
    align-items: center;
  }
  input[type='checkbox'] {
    -webkit-appearance: none;
    appearance: none;
    background-color: var(--form-background);
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 2em;
    height: 2em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
    padding: 8px;
  }

  input[type='checkbox']::before {
    content: '';
    width: 1.3em;
    height: 1.3em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: 0 4px 8px #0000009e;
    background-color: CanvasText;
  }

  input[type='checkbox']:checked::before {
    transform: scale(1);
  }

  input[type='checkbox']:focus {
    outline: max(2px, 0.15em) solid currentColor;
    outline-offset: max(2px, 0.15em);
  }

  input[type='checkbox']:disabled {
    --form-control-color: var(--form-control-disabled);

    color: var(--form-control-disabled);
    cursor: not-allowed;
  }
  label {
    margin-left: 16px;
  }
</style>
