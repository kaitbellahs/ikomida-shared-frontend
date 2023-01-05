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

  $: icon = expanded ? faChevronUp : faChevronDown
  $: if (id !== $ExpandableBox) {
    expanded = false
  }

  function toggleBox() {
    if (!expanded) {
      Stores.ExpandableBox.instance.toggle(id)
    }
    expanded = !expanded
  }

  function easeIn(_: HTMLDivElement, { duration }: { duration: number }) {
    return {
      duration,
      css: (t: number) => {
        const css = `
    ${t === 1 ? 'overflow:none;max-height: fit-content;' : `overflow:hidden;max-height: ${t * 100}vh;`};
    `
        return css
      }
    }
  }

  function easeOut(_: HTMLDivElement, { duration }: { duration: number }) {
    return {
      duration,
      css: (t: number) => {
        const css = `
    ${t === 1 ? 'overflow:none;max-height: fit-content;' : `overflow:hidden;max-height: ${t * 100}vh;`};
    `
        return css
      }
    }
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
  {#if expanded}
    <box in:easeIn={{ duration: 300 }} out:easeOut={{ duration: 300 }}>
      <slot />
    </box>
  {/if}
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
  }
  box:first-of-type {
    margin-top: 0;
  }
  h2.expanded {
    border-bottom: 1px solid #ccc;
  }
</style>
