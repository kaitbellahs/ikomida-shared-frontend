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

  const ANIMATION_PREFIX = 'animate__'
  const inAnimationList: number[] = []
  const visibleItemsList: number[] = []

  let mainScroll: MainScroll = MainScroll.createInstance()
  let scroll: TScroll

  $: if ((animationIn || animationOut) && scroll && itemsList) {
    handleAnimation()
  }

  $: {
    const list = itemsList.filter(item => item)
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      if (node && !node.classList.contains(`${ANIMATION_PREFIX}animated`)) {
        node.classList.add(`${ANIMATION_PREFIX}animated`)
      }
    }
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
    scroll = new TScroll(element?.scrollTop, element?.scrollHeight, element?.offsetHeight)
    mainScroll?.set(scroll)
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
    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      if (node) {
        const nodeTop = node.getBoundingClientRect().top
        const divider = 12
        const height = scroll?.offsetHeight ?? 0
        if (nodeTop > ((-1 * height) / divider) * 2 && nodeTop < (height / divider) * (divider - 1)) {
          if (!visibleItemsList.includes(i) && !inAnimationList.includes(i)) {
            node.style.visibility = 'visible'
            inAnimationList.push(i)
            await animateCSS(node, animationIn ?? 'backInLeft', ANIMATION_PREFIX)
            removeFromList(i, inAnimationList)
            visibleItemsList.push(i)
          }
        } else {
          if (visibleItemsList.includes(i) && !inAnimationList.includes(i)) {
            inAnimationList.push(i)
            await animateCSS(node, animationOut ?? 'backOutRight', ANIMATION_PREFIX)
            node.style.visibility = 'invisible'
            removeFromList(i, inAnimationList)
            removeFromList(i, visibleItemsList)
          }
        }
      }
    }
  }
  onMount(() => {
    if (element) {
      addEventListener()
      scroll = new TScroll(element?.scrollTop, element?.scrollHeight, element?.offsetHeight)
      mainScroll?.set(scroll)
      handleAnimation()
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
