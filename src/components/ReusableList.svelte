<script lang="ts">
  import { onMount, tick } from 'svelte'
  import Divider from './Divider.svelte'
  import Button from './Button.svelte'
  import LocalLoading from './LocalLoading.svelte'
  import GTerms from './GTerms.svelte'

  type T = $$Generic
  interface $$Slots {
    default: {
      item: T
      index: number
    }
  }

  export let divider = 24
  export let itemHeight: number | null = null
  export let localLoading = false
  export let canGetMore = false
  export let getMore: ((refresh: boolean) => void) | null = null
  export let hasRecaptcha = false
  export let items: T[]

  export let start = 0
  export let end = 0

  let height_map: (number | null)[] = []
  let rows: string | any[]
  let viewport: { scrollTo?: any; scrollTop?: any }
  let contents: { getElementsByTagName: (arg0: string) => string | any[] }
  let viewport_height = 0
  let visible: ArrayLike<{ index: number; data: T }>
  let mounted: boolean

  let screenWidth: number
  let top = 0
  let bottom = 0
  let average_height: number

  $: itensPerRow = screenWidth > 480 ? 2 : 1

  $: visible = items.slice(start, end).map((data, i) => {
    return { index: i + start, data }
  })

  $: if (mounted) refresh(items, viewport_height, itemHeight)

  async function refresh(items: string | T[], viewport_height: number, itemHeight: number | null) {
    const { scrollTop } = viewport

    await tick()

    let content_height = top - scrollTop
    let i = start

    while (content_height < viewport_height && i < items.length) {
      let row = rows[i - start]

      if (!row) {
        end = i + itensPerRow
        await tick()
        row = rows[i - start]
      }

      const row_height = (height_map[i] = itemHeight || row?.offsetHeight)
      content_height += row_height
      i += itensPerRow
    }

    end = i

    const remaining = items.length - end
    average_height = (top + content_height) / end

    bottom = remaining * average_height
    height_map.length = items.length
  }

  async function handle_scroll() {
    const { scrollTop } = viewport

    const old_start = start

    for (let v = 0; v < rows.length; v += itensPerRow) {
      height_map[start + v] = itemHeight || rows[v].offsetHeight
    }

    let i = 0
    let y = 0

    while (i < items.length) {
      const row_height = height_map[i] || average_height
      if (y + row_height > scrollTop) {
        start = i
        top = y

        break
      }

      y += row_height
      i += itensPerRow
    }

    while (i < items.length) {
      y += height_map[i] || average_height
      i += itensPerRow

      if (y > scrollTop + viewport_height) break
    }

    end = i

    const remaining = items.length - end
    average_height = y / end

    while (i < items.length) height_map[i++] = average_height
    bottom = remaining * average_height

    if (start < old_start) {
      await tick()

      let expected_height = 0
      let actual_height = 0

      for (let i = start; i < old_start; i += itensPerRow) {
        if (rows[i - start]) {
          expected_height += height_map[i] ?? 0
          actual_height += itemHeight || rows[i - start].offsetHeight
        }
      }

      const d = actual_height - expected_height
      viewport.scrollTo(0, scrollTop + d)
    }
  }

  onMount(() => {
    rows = contents.getElementsByTagName('reusableListRow')
    mounted = true
  })
</script>

<svelte:window bind:innerWidth={screenWidth} />
<resusableListViewport bind:this={viewport} bind:offsetHeight={viewport_height} on:scroll={handle_scroll}>
  <resusableListContents bind:this={contents} style="padding-top: {top}px; padding-bottom: {bottom}px;">
    {#each visible as row (row.index)}
      <reusableListRow class="shadow" style="--divider:{divider}px">
        <slot index={row.index} item={row.data}>Ocurreu um erro, entre em contato com o suporte</slot>
      </reusableListRow>
    {/each}
  </resusableListContents>

  {#if localLoading}
    <Divider height={12} />
    <LocalLoading />
  {/if}
  {#if !localLoading && canGetMore}
    <Divider />
    <Button sizeMultiplier={0.8} on:click={() => getMore?.(false)}>carregar mais</Button>
  {/if}
  {#if hasRecaptcha}
    <GTerms />
  {/if}
</resusableListViewport>

<style>
  resusableListViewport {
    position: relative;
    -webkit-overflow-scrolling: touch;
    display: flex;
    overflow-y: auto;
    height: 100%;
    left: 0;
    right: 0;
    padding: 0 16px;
    width: 100%;
    flex-direction: column;
  }

  resusableListContents,
  reusableListRow {
    display: flex;
    flex-direction: column;
  }

  reusableListRow {
    margin-top: var(--divider);
    border-radius: 8px;
  }
  @media (min-width: 481px) {
    resusableListContents {
      flex-direction: row;
      flex-wrap: wrap;
    }
    reusableListRow {
      flex-grow: 1;
      width: calc(50% - 16px);
      max-width: calc(50% - 16px);
      margin: 16px 8px;
    }
  }
</style>
