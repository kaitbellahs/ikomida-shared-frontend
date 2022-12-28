<script lang="ts">
  import MainScroll from '../Stores/MainScroll.js'
  import TScroll from '../Types/TScroll.js'

  export let style = ''
  export let scroll = false
  export let element: HTMLElement | undefined = undefined

  let mainScroll: MainScroll = MainScroll.createInstance()
  $: if (element && scroll) {
    element.addEventListener('scroll', (event: Event) => {
      const scroll = new TScroll(element?.scrollTop, element?.scrollHeight, element?.offsetHeight)
      mainScroll?.set(scroll)
    })
  }
</script>

<main {style} bind:this={element}>
  <slot />
</main>

<style>
  main {
    padding: var(--padding);
    padding-top: var(--paddingTop);
    overflow: hidden;
    max-width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: var(--paddingBottom);
    height: 100vh;
    max-height: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }
</style>
