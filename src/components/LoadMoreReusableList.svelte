<script lang="ts">
  import Network from '../Network/Network';
  import Menu from '../Stores/Menu';
  import Loading from '../Stores/Loading';
  import LoadMore from '../Stores/LoadMore';
  import CentredMessage from './CentredMessage.svelte';
  import ReusableList from './ReusableList.svelte';
  import { onMount } from 'svelte';
  import { faSync } from '@fortawesome/free-solid-svg-icons';

  type T = $$Generic;
  interface $$Slots {
    default: {
      item: T;
      index: number;
    };
    centredMessage: {};
  }

  export let url: string;
  export let cache: string;
  export let noItems: string = '';
  export let hasRecaptcha = false;
  export let items: T[];
  let localLoading = false;
  let canGetMore = true;
  let working = false;
  let cleanRefresh = LoadMore.instance.store;

  $: if ($cleanRefresh) {
    refresh().then(() => LoadMore.instance.completed());
  }

  async function getMore(refresh = false) {
    working = true;
    if (refresh) {
      Loading.instance.start();
    } else {
      localLoading = true;
    }
    [canGetMore, items] = (await Network.instance?.loadMore(cache, url, true, refresh)) ?? [];
    if (refresh) {
      Loading.instance.stop();
    } else {
      localLoading = false;
    }
    working = false;
  }

  async function refresh() {
    await getMore(true);
  }

  onMount(async () => {
    Loading.instance.start();
    Menu.instance.addItem({
      name: 'Atualiza e limpa cache',
      icon: faSync,
      callback: refresh,
    });
    await getMore(false);
    Loading.instance.stop();
  });
</script>

{#if (items?.length ?? 0) > 0}
  <ReusableList bind:localLoading bind:canGetMore {items} {getMore} {hasRecaptcha} let:item let:index>
    <slot {index} {item} />
  </ReusableList>
{:else if !working}
  <CentredMessage text={noItems ?? 'Não há dados para exibir'}>
    <slot name="centredMessage" />
  </CentredMessage>
{:else}
  <CentredMessage text={'Carregando dados...'} />
{/if}
