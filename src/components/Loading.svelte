<script lang="ts">
  import Fa from 'svelte-fa';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';
  import Loading from '../Stores/Loading';

  export let opacity = 0.875;
  export let topPadding = 0;
  export let bottomPadding = 0;
  let isLoading = Loading.createInstance(true).store;
  $: topMargin = topPadding + 50 + 'px';
  $: styleBottomPadding = bottomPadding + 50 + 'px';
</script>

{#if $isLoading}
  <div style="--opacity: {opacity};--topMargin: {topMargin};--bottomPadding:{styleBottomPadding}">
    <Fa
      style="font-size: 3em;
color: white;"
      pulse={true}
      icon={faSpinner}
    />
  </div>
{/if}

<style>
  div {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, var(--opacity));
    display: flex;
    align-items: center;
    place-content: center;
  }
</style>
