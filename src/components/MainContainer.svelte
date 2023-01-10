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
    max-width: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    padding-bottom: var(--paddingBottom);
    max-height: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    flex-wrap: wrap;
  }
</style>
