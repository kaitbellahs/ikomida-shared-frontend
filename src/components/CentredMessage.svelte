<script lang="ts">
  export let text: string
</script>

<div class="content backgroundCustomColor">
  {#if text}
    <h2>
      {text}
    </h2>
  {/if}
  <slot />
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
  .content > :global(*) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
