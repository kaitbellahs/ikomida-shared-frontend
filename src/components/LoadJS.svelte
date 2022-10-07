<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let url: string
  let script: HTMLScriptElement

  onMount(async () => {
    script.addEventListener('load', () => {
      dispatch('loaded')
    })

    script.addEventListener('error', (event: HTMLElementEventMap['error']) => {
      dispatch('error')
    })
  })
</script>

<svelte:head>
  <script bind:this={script} src={url} async defer></script>
</svelte:head>
