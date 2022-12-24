<script lang="ts">
  import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
  import FloatButton from './FloatButton.svelte'
  import { v4 as uuid } from 'uuid'
  import { Stores } from '..'
  import { onMount } from 'svelte'

  export let title: string
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

  onMount(() => {
    ExpandableBox = Stores.ExpandableBox.createInstance().store
  })
</script>

<expandableBox class="shadow">
  <FloatButton bind:icon top={4} right={4} callback={toggleBox} />
  <h2 on:click={toggleBox}>{title}</h2>
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
    padding: 16pt;
    border-radius: 8pt;
    display: flex;
    flex-direction: column;
    margin-top: 16pt;
    /* overflow: hidden; */
  }
  box {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 16pt;
  }
  box:first-of-type {
    margin-top: 0;
  }
</style>
