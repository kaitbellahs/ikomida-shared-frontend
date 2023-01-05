<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let checked: boolean = false
  export let name: string | null = null

  function onClick() {
    dispatch('check', { checked: !checked })
  }
</script>

<button class="switchContainer" on:click={onClick}>
  <label class="shadow switch">
    <input type="checkbox" bind:checked />
    <span class="slider round" />
  </label>
  <span class="title">{name || ''}</span>
</button>

<style>
  button {
    border: 0;
    background-color: transparent;
  }
  .switchContainer {
    display: flex;
    place-items: center;
    width: 100%;
    margin-top: 16px;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 64px;
    height: 32px;
    border-radius: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switchContainer > .title {
    font-size: 1.1em;
    margin-left: 8px;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 4px 8px #0000009e;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(32px);
    -ms-transform: translateX(32px);
    transform: translateX(32px);
  }

  .slider.round {
    border-radius: 24px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
