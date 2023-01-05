<script lang="ts">
  import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import FloatButton from './FloatButton.svelte'
  import { v4 as uuid } from 'uuid'
  import { Stores } from '..'
  import { onMount, tick } from 'svelte'

  export let title: string
  export let expand = false
  export let expanded = false

  const id = uuid()
  let ExpandableBox: Stores.ExpandableBox
  let element: HTMLElement

  $: icon = expanded ? faChevronUp : faChevronDown
  $: if (id !== $ExpandableBox) {
    expanded = false
  }

  $: height = element
    ? Array.from(element?.children)
        .flatMap(child => {
          const style = getComputedStyle(child)
          return (
            Number(style.height.replace('px', '')) +
            Number(style.marginTop.replace('px', '')) +
            Number(style.marginBottom.replace('px', '')) +
            Number(style.borderTopWidth.replace('px', '')) +
            Number(style.borderBottomWidth.replace('px', ''))
          )
        })
        .reduce((child1, child2) => child1 + child2)
    : 0

  $: if (expanded) {
    element?.addEventListener(
      'transitionend',
      () => {
        element.style.overflow = 'visible'
      },
      { once: true }
    )
  } else {
    if (element) {
      element.style.overflow = 'hidden'
    }
  }

  function toggleBox() {
    if (!expanded) {
      Stores.ExpandableBox.instance.toggle(id)
    }
    expanded = !expanded
  }

  onMount(async () => {
    ExpandableBox = Stores.ExpandableBox.createInstance().store
    if (expand) {
      await tick()
      expanded = true
    }
  })
</script>

<expandableBox class="shadow">
  <FloatButton bind:icon top={expanded ? 4 : 16} right={4} callback={toggleBox} />
  <h2 class:expanded on:click={toggleBox}>{title}</h2>
  <box class:expanded bind:this={element} style="--height:{height}px;">
    <slot />
  </box>
</expandableBox>

<style>
  expandableBox {
    position: relative;
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }
  box {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    height: 0px;
    transition: all 0.3s;
    overflow: hidden;
  }
  box.expanded {
    height: var(--height);
  }
  box:first-of-type {
    margin-top: 0;
  }
  h2.expanded {
    border-bottom: 1px solid #ccc;
  }
</style>
