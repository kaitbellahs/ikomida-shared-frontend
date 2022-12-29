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
  export let topEdge = 20
  export let bottomEdge = 95

  const ANIMATION_PREFIX = 'animate__'
  let inAnimationList: number[] = []
  let outAnimationList: number[] = []
  let visibleItemsList: number[] = []
  let inVisibleItemsList: number[] = []
  let scrollStep = 25
  let lastScrollTop = 0

  let mainScroll: MainScroll = MainScroll.createInstance()
  let scroll: TScroll

  $: if ((animationIn || animationOut) && scroll && itemsList) {
    handleAnimation()
  }

  $: if (itemsList) {
    const list = itemsList.filter(item => item)
    inVisibleItemsList = []
    visibleItemsList = []
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      if (node && !node.classList.contains(`${ANIMATION_PREFIX}animated`)) {
        node.classList.add(`${ANIMATION_PREFIX}animated`)
        inVisibleItemsList.push(i)
      }
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
            await animateCSS(node, animationIn ?? 'backInLeft', ANIMATION_PREFIX)
            removeFromList(i, inVisibleItemsList)
          }
        } else {
          if (visibleItemsList.includes(i) && !inVisibleItemsList.includes(i)) {
            inVisibleItemsList.push(i)
            await animateCSS(node, animationOut ?? 'backOutRight', ANIMATION_PREFIX)
            removeFromList(i, visibleItemsList)
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
  style="--height:{realHight ? `${realHight}px` : '100%'};--backgroundImage: url('{backgroundImage
    ? backgroundImage
    : 'none'}');{style}"
  bind:this={element}
>
  <slot />
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
  .scroll {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }
</style>
