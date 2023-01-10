<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import { v4 as uuidV4 } from 'uuid'
  import Fa from 'svelte-fa'
  import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
  import { AppLauncher } from '@capacitor/app-launcher'
  import { onDestroy, onMount } from 'svelte'
  import Alert from './Alert.svelte'
  import Navigation from '../Stores/Navigation'
  import MenuHamburger from '../Stores/MenuHamburger'
  import Title from '../Stores/Title'
  import Menu from '../Stores/Menu'
  import MessageAlert from '../Stores/MessageAlert'
  import { Capacitor } from '@capacitor/core'
  import { Clipboard } from '@capacitor/clipboard'

  import { Layout as LayoutStore, Loading } from '../Stores'
  import Image from './Image.svelte'
  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store

  export let logo = ''
  export let paddingTop = 0
  export let topMargin = 0
  export let paddingBottom = 0

  let swipeGoBack: boolean = false
  let showMenu = false
  let _showMenuHamburger = false
  let showAlert = false
  let App: any
  let menuHamburger = MenuHamburger.instance?.store
  let menu = Menu.instance?.store
  let title = Title.instance?.store
  let navigation: Navigation = Navigation.instance
  let stack = navigation?.store

  let swipe = {
    x: 0,
    y: 0,
    t: 0,
    c: 600
  }

  $: if (swipeGoBack) {
    swipeGoBack = false
    goBack()
  }

  $: if ($stack) {
    reset()
  }

  function reset() {
    showMenu = false
    _showMenuHamburger = false
    showAlert = false
  }

  function easeIn(_: HTMLDivElement, { duration }: { duration: number }) {
    return {
      duration,
      css: (t: number) => `
        transform: translateX(-${100 - t * 100}%);
    left: -${100 - t * 100}%;
    `
    }
  }

  function easeOut(_: HTMLDivElement, { duration }: { duration: number }) {
    return {
      duration,
      css: (t: number) => `
        transform: translateX(-${100 - t * 100}%);
    left: -${100 - t * 100}%;
    `
    }
  }

  function goBack() {
    if (navigation?.callBack) {
      navigation?.callBack?.()
    } else {
      if (($stack?.length ?? 0) > 1 || Capacitor.getPlatform() !== 'android') {
        navigation.pop()
      } else {
        toggleAlert()
      }
    }
    reset()
  }

  function toggleMenu() {
    showMenu = !showMenu
  }

  function toggleAlert() {
    showAlert = !showAlert
  }

  function showMenuHamburger() {
    _showMenuHamburger = true
  }
  function hideMenuHamburger() {
    _showMenuHamburger = false
  }

  function callHamburgerCallback(callback: () => void) {
    callback?.()
    hideMenuHamburger()
  }

  function callCallback(callback: () => void) {
    toggleMenu()
    callback?.()
  }

  async function openIkomida() {
    const url = 'https://ikomida.com'
    const { value } = await AppLauncher.canOpenUrl({ url })
    await AppLauncher.openUrl({ url })
    if (!value) {
      await Clipboard.write({ string: url })
      MessageAlert.instance.show(
        `Se o navegador externo não abriu: abra o e digitar essa URL: ${url}, também foi copiado para sua área de transferência para colar-lo!`
      )
    }
  }

  function StartSwipe(e: any) {
    swipe.x = e?.changedTouches?.[0]?.screenX ?? 0
    swipe.y = e?.changedTouches?.[0]?.screenY ?? 0
    swipe.t = new Date().getTime()
  }

  function EndSwipe(e: any) {
    const time = new Date().getTime() - swipe.c
    if (time > 0 && time < swipe.t) {
      const swipex = swipe.x - (e?.changedTouches?.[0]?.screenX ?? 0)
      const swipey = swipe.y - (e?.changedTouches?.[0]?.screenY ?? 0)
      swipeGoBack = swipex > 90 && swipey < swipex
    }
  }
  function addStartEventListener(source: Window & typeof globalThis, cb: (e: any) => void) {
    source.addEventListener('mousedown', cb)
    source.addEventListener('touchstart', cb, { passive: true })
  }

  function removeStartEventListener(source: Window & typeof globalThis, cb: (e: any) => void) {
    source.removeEventListener('mousedown', cb)
    source.removeEventListener('touchstart', cb)
  }

  function addEndEventListener(source: Window & typeof globalThis, cb: (e: any) => void) {
    source.addEventListener('mouseup', cb)
    source.addEventListener('touchend', cb)
  }

  function removeEndEventListener(source: Window & typeof globalThis, cb: (e: any) => void) {
    source.removeEventListener('mouseup', cb)
    source.removeEventListener('touchend', cb)
  }

  onMount(async () => {
    try {
      const capacitor = await import('@capacitor/app')
      App = capacitor?.App
      App?.addListener('backButton', goBack)
    } catch (_) {}
    addStartEventListener(window, StartSwipe)
    addEndEventListener(window, EndSwipe)
  })

  onDestroy(() => {
    removeStartEventListener(window, StartSwipe)
    removeEndEventListener(window, EndSwipe)
  })
</script>

<header
  class="shadow"
  style="--topMargin: {topMargin}px;--paddingTop: {paddingTop}px;--paddingBottom: {paddingBottom}px;--background:{$Layout
    ?.header?.background ?? '#4c0708'};--color:{$Layout?.header?.color || '#ffffff'};--menuHamburger:{$Layout?.header
    ?.menuHamburger ?? '#ffffff'};"
>
  {#if ($stack?.length ?? 0) > 1}
    <button id="backButton" on:click={goBack}>
      <div>
        <Fa style="font-size: 1.7em;" icon={faChevronLeft} />
      </div>
    </button>
  {:else if ($menuHamburger?.length ?? 0) > 0}
    <button class="menuHamburger" on:click={_showMenuHamburger ? hideMenuHamburger : showMenuHamburger}>
      <div />
      <div />
      <div />
    </button>
    {#if _showMenuHamburger}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        in:easeIn={{ duration: 300 }}
        out:easeOut={{ duration: 300 }}
        id="menuHamburger"
        on:click|stopPropagation={hideMenuHamburger}
      >
        <ul>
          {#if logo}
            <li class="logo"><Image source={logo} name="iKomida" /></li>
          {/if}
          {#each $menuHamburger as menu (menu?.uuid ?? uuidV4())}
            {#if menu}
              <li on:click={() => callHamburgerCallback(menu?.callback)}>
                {#if menu?.icon}
                  <div class="icon">
                    <Fa style="font-size: 1.3em;" icon={menu?.icon} />
                  </div>
                {/if}
                <span>{menu?.name}</span>
              </li>
            {/if}
          {/each}
          <li on:click={openIkomida}>
            <span>Powered by</span>&nbsp;<span style="color: {$Layout?.link ?? '#e8d130'};">iKomida</span>
          </li>
        </ul>
      </div>
    {/if}
  {/if}
  <h1>{$title}</h1>
  {#if ($menu?.length ?? 0) === 1 && $menu?.[0].icon}
    <button class="menu" on:click={() => callCallback($menu?.[0].callback)}>
      <Fa
        style="color: {$Layout?.header?.menuHamburger ?? '#ffffff'};font-size: 1.5em; margin-right: 16px;"
        icon={$menu?.[0].icon}
      />
    </button>
  {:else if ($menu?.length ?? 0) > 0}
    <button class="menu" on:click={toggleMenu}>
      <div />
      <div />
      <div />
    </button>
    <ul class="menu" class:showMenu>
      {#each $menu as { icon, name, callback }}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li on:click={() => callCallback(callback)}>
          {#if icon}
            <Fa style="font-size: 1.5em; margin-right: 16px;" {icon} />
          {/if}
          {name}
        </li>
      {/each}
    </ul>
  {:else if ($menu?.length ?? 0) == 1}
    <button class="singleMenuItem" on:click={$menu[0].callback}
      ><Fa style="font-size: 1.5em; margin-right: 16px;" icon={$menu[0].icon} /></button
    >
  {/if}
</header>
{#if showAlert}
  <Alert
    title="Alerta"
    message={`Você quer realmente fechar o App?`}
    closeCallBack={toggleAlert}
    buttons={[
      {
        name: 'Sim',
        callback: () => {
          App?.exitApp()
        }
      },
      {
        name: 'Não quero',
        callback: toggleAlert,
        principal: true
      }
    ]}
  />
{/if}

<style>
  button {
    border: 0;
    background-color: transparent;
  }
  button.menu {
    flex-direction: column;
    height: 32px;
    padding: 0;
    margin: 0;
    place-content: center;
    place-items: center;
    justify-items: center;
    display: flex;
    overflow: hidden;
    flex-grow: 0;
    flex-shrink: 0;
  }
  button.menu > div {
    background: var(--menuHamburger);
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin: 2px 16px 1px 4px;
  }
  ul.menu {
    display: none;
    position: fixed;
    right: 0;
    top: calc(54px+ var(--topMargin));
    background: var(--background);
    list-style: none;
    padding: 0;
    min-width: 50%;
    max-width: 100%;
    overflow: hidden;
    font-size: 1.2em;
  }
  ul.showMenu {
    display: block;
  }
  ul.menu > li {
    padding: 16px;
    display: flex;
  }
  .singleMenuItem {
    background: transparent;
    border: 0;
  }
  button.menuHamburger {
    flex-direction: column;
    height: 32px;
    padding: 0;
    margin: 0;
    place-content: center;
    place-items: center;
    justify-items: center;
    display: flex;
    overflow: hidden;
    flex-grow: 0;
    flex-shrink: 0;
  }
  button.menuHamburger > div {
    background: var(--menuHamburger);
    display: block;
    height: 4px;
    border-radius: 4px;
    width: 32px;
    margin: 4px 16px;
  }
  #menuHamburger > ul {
    display: flex;
    flex-direction: column;
    background: var(--background);
    list-style: none;
    padding: 0;
    min-width: 90%;
    max-width: 90%;
    height: 100%;
    overflow: hidden;
    padding-top: 12px;
    font-size: 1.2em;
    overflow-y: scroll;
    box-shadow: 0 4px 8px #0000009e;
  }
  #menuHamburger {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: calc(48px + var(--paddingTop) + var(--topMargin) - 4px);
    background: rgba(0, 0, 0, 0.7);
    padding: 0;
    min-width: 100vw;
    max-width: 100vw;
    height: calc(100vh - 48px - var(--paddingTop) - var(--topMargin) - 4px);
    overflow: hidden;
    overflow-y: scroll;
  }
  #menuHamburger > ul > li {
    padding: 12px 16px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
  }
  #menuHamburger > ul > li.logo {
    padding: 8px 16px;
    place-content: center;
    border-bottom: 0.1px solid #ffffff29;
  }
  #menuHamburger > ul > li.logo > :global(img) {
    width: 100%;
    max-width: 480px;
    border-radius: 32px;
    max-height: 260px;
    object-fit: contain;
  }
  #menuHamburger > ul > li:last-of-type {
    flex-grow: 1;
    align-items: flex-end;
    padding-bottom: calc(64px + var(--paddingBottom));
  }
  #menuHamburger > ul > li > .icon {
    margin-right: 24px;
    place-content: flex-start;
    place-items: center;
    justify-items: center;
    display: flex;
    overflow: hidden;
    flex-grow: 0;
    flex-shrink: 0;
  }
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--background);
    color: var(--color);
    display: flex;
    width: 100%;
    min-height: calc(48px + var(--paddingTop) + var(--topMargin));
    padding: 8px;
    padding-top: calc(var(--paddingTop) + var(--topMargin)+8px);
    box-shadow: 0 4px 8px #0000009c;
    align-items: center;
    z-index: 99999999;
  }
  header > #backButton {
    font-weight: bold;
    background-color: transparent;
    color: var(--menuHamburger);
    border: 0;
    flex-direction: column;
    padding: 0;
    margin: 0;
    place-content: center;
    place-items: center;
    justify-items: center;
    display: flex;
    overflow: hidden;
    flex-grow: 0;
    flex-shrink: 0;
  }
  header > #backButton > div {
    display: flex;
    place-content: center;
    align-items: center;
    width: 48px;
  }
  header > h1 {
    background-color: transparent;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.55em;
    padding: 0;
    flex: 1;
  }
  @media (min-width: 481px) {
    #menuHamburger > ul {
      max-width: 80%;
      min-width: 40%;
      width: fit-content;
    }
  }
</style>
