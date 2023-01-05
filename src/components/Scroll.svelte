<script lang="ts">
  import { onMount } from 'svelte'
  import MainScroll from '../Stores/MainScroll.js'
  import TScroll from '../Types/TScroll.js'
  import { animateCSS } from '../Utils/Objects.js'

  export let tag = 'scroll'
  export let style = ''
  export let animationIn = ''
  export let animationOut = ''
  export let backgroundImage = ''
  export let element: HTMLElement | undefined = undefined
  export let itemsList: HTMLDivElement[] = []
  export let topEdge = 35
  export let bottomEdge = 95
  export let scrollStep = 5
  export let showHeader = false
  export let scrollTo = 0

  const ANIMATION_PREFIX = 'animate__'
  let visibleItemsList: number[] = []
  let inVisibleItemsList: number[] = []
  let lastScrollTop = 0
  let scroll: TScroll
  let mainScroll: MainScroll = MainScroll.createInstance()
  $: if (scrollTo) {
    element?.scrollTo({ top: scrollTo, behavior: 'smooth' })
    scrollTo = 0
  }

  $: if ((animationIn || animationOut) && (scroll || scrollTo) && itemsList) {
    handleAnimation()
  }

  $: if (itemsList) {
    const list = itemsList.filter(item => item)
    inVisibleItemsList = []
    visibleItemsList = []
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      if (node && !node.classList.contains(`${ANIMATION_PREFIX}animated`)) {
        for (const classItem of node.classList) {
          if (classItem.startsWith(ANIMATION_PREFIX)) {
            node.classList.remove(classItem)
          }
        }
      }
      node.classList.add(`${ANIMATION_PREFIX}animated`)
      inVisibleItemsList.push(i)
    }
    handleAnimation()
  }

  $: if (element) {
    addEventListener()
  }

  $: realHight =
    itemsList && element?.children
      ? Array.from(element?.children)
          .flatMap(child => child.clientHeight)
          .reduce((child1, child2) => child1 + child2) + 50
      : 0

  const handleScroll = (event: Event) => {
    if (
      (element?.scrollTop ?? 0) > lastScrollTop + scrollStep ||
      (element?.scrollTop ?? 0) < lastScrollTop - scrollStep
    ) {
      lastScrollTop = element?.scrollTop ?? 0
      scroll = new TScroll(element?.scrollTop, element?.scrollHeight, element?.offsetHeight)
      mainScroll?.set(scroll)
    }
  }

  function addEventListener() {
    element?.removeEventListener('scroll', handleScroll)
    element?.addEventListener('scroll', handleScroll)
  }

  function removeFromList(element: any, list: any[], count = 1) {
    const index = list?.indexOf(element)
    if ((index ?? -1) > -1) {
      list?.splice(index, count)
    }
  }

  async function handleAnimation() {
    const list = itemsList.filter(item => item)
    const height = scroll?.offsetHeight ?? 0
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      if (node) {
        const nodeTop = node.getBoundingClientRect().top
        const nodeheight = node.getBoundingClientRect().height
        if (nodeTop > topEdge && nodeTop < height - bottomEdge) {
          if (!visibleItemsList.includes(i) && inVisibleItemsList.includes(i)) {
            node.style.visibility = 'visible'
            visibleItemsList.push(i)
            // visibleItemsList = visibleItemsList
            await animateCSS(node, animationIn ?? 'backInLeft', ANIMATION_PREFIX)
            removeFromList(i, inVisibleItemsList)
            // inVisibleItemsList = inVisibleItemsList
          }
        } else {
          if (visibleItemsList.includes(i) && !inVisibleItemsList.includes(i)) {
            inVisibleItemsList.push(i)
            // inVisibleItemsList = inVisibleItemsList
            await animateCSS(node, animationOut ?? 'backOutRight', ANIMATION_PREFIX)
            removeFromList(i, visibleItemsList)
            // visibleItemsList = visibleItemsList
            node.style.visibility = 'hidden'
          }
        }
      }
    }
  }
  onMount(async () => {
    if (element) {
      addEventListener()
      scroll = new TScroll(element?.scrollTop, element?.scrollHeight, element?.offsetHeight)
      mainScroll?.set(scroll)
      await handleAnimation()
    }
  })
</script>

<svelte:element
  this={tag}
  class="scroll"
  style="overflow:hidden;padding:0;--height:{realHight
    ? `${realHight}px`
    : '100%'};--backgroundImage: url('{backgroundImage ? backgroundImage : 'none'}');{style}"
>
  {#if $$slots.header && showHeader}
    <slot name="header" />
  {/if}
  <scroll bind:this={element}>
    <slot scroller={scroll} />
  </scroll>
</svelte:element>

<style>
  .scroll::before {
    content: '';
    background-image: var(--backgroundImage);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--height);
    opacity: 0.3;
  }
  scroll {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    padding: 16px;
    padding-bottom: 168px;
  }
  header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    z-index: 10;
    place-items: stretch;
    overflow-y: scroll;
    padding: 8px;
    border-radius: 0;
  }
</style>
