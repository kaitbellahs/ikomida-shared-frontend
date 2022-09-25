<script lang="ts">
  import Fa from 'svelte-fa';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';

  export let size = 2;
</script>

<div>
  <Fa style="font-size: {size}em; color: black;" pulse={true} icon={faSpinner} />
</div>

<style>
  div {
    display: flex;
    width: 100%;
    place-content: center;
    place-items: center;
    justify-content: center;
    justify-items: center;
  }
</style>
