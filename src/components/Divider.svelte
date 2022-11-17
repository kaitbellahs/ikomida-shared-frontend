<script lang="ts">
  export let height = 24
</script>

<div style="--height:{height}pt" />

<style>
  div {
    width: 100%;
    height: var(--height);
    min-height: var(--height);
    max-height: var(--height);
  }
</style>
