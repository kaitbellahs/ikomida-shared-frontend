<script lang="ts">
  export let source = ''
  export let name = ''
  export let height = ''
  export let width = ''

  let showImage = true
  function erroLoadImage() {
    showImage = false
  }
</script>

{#if showImage && source}
  <img
    on:error={() => erroLoadImage()}
    src={source}
    alt={name}
    style="{height ? `height:${height};` : ''}{width ? `width:${width};` : ''}"
  />
{/if}

<style>
  img {
    width: 100%;
    max-width: 100%;
    object-fit: contain;
  }
</style>
