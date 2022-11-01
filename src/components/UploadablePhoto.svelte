<script lang="ts">
  import type { Classes } from '@ikomida/shared-types'
  import type { Writable } from 'svelte/store'
  import Cropper from './Cropper.svelte'
  import getCroppedImg from '../Utils/Canvas'
  import type { IPixelCrop } from '../Utils/Canvas'
  import Fa from 'svelte-fa'
  import { faCamera } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import LocalLoading from './LocalLoading.svelte'
  import { resizeImage } from '../Utils/Image'
  import { Layout as LayoutStore } from '../Stores'
  import TUploadablePhoto from '../Types/TUploadablePhoto'
  import Alert from './Alert.svelte'

  export let image: string | undefined
  export let title: string | undefined = undefined
  export let name: string | undefined = undefined
  export let lastName: string | undefined = undefined
  export let type: TUploadablePhoto | undefined = undefined

  let Layout: Writable<Classes.CLayout | undefined> = LayoutStore.instance.store
  let rawImage: string | undefined
  let crop = { x: 0, y: 0 }
  let zoom = 1
  let pixelCrop: IPixelCrop
  let dataType: string
  let showImage = true
  let isLoading = true
  let fileinput: HTMLInputElement
  let container: HTMLDivElement | undefined = undefined

  $: height =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? 'calc(100vw - 40px)'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : `${container ? (container.clientWidth / 500) * 260 : 260}px`
  $: width =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? 'calc(100vw - 40px)'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : 'calc(100vw - 40px)'
  $: cropHeightString =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? 'calc(100vw - 80px)'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : `${container ? (container.clientWidth / 500) * 260 : 260}px`
  $: cropWidthString =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? 'calc(100vw - 80px)'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : 'calc(100vw - 80px)'
  $: minHeight =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? '500px'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : `${container ? (container.clientWidth / 500) * 260 : 260}px`
  $: cropHeight =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? 500
      : type === TUploadablePhoto.PROFILE
      ? 210
      : type === TUploadablePhoto.THUMB
      ? 45
      : container
      ? (container.clientWidth / 500) * 260
      : 260
  $: cropWidth =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE, TUploadablePhoto.THUMB].includes(type)
      ? 500
      : type === TUploadablePhoto.PROFILE
      ? 210
      : type === TUploadablePhoto.THUMB
      ? 45
      : 500
  $: cropSize = {
    width: container ? container.clientWidth : cropWidth,
    height: container ? container.clientHeight : cropHeight
  }

  async function cropImage() {
    if (rawImage) {
      const croppedImage = await getCroppedImg(rawImage, pixelCrop, dataType)
      if (croppedImage) {
        image = await resizeImage(croppedImage, cropWidth, cropHeight, dataType)
        showImage = true
        rawImage = undefined
      }
    }
  }

  async function onFileSelected(event: any) {
    let imageFile = await event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = async (e: any) => {
      ;[dataType] = e.target.result.split(';')
      rawImage = e.target.result
    }
    fileinput.value = ''
  }

  async function openFileSelector() {
    fileinput.click()
  }

  function hideImage() {
    showImage = false
    isLoading = false
  }

  function imageLoaded() {
    isLoading = false
  }

  async function closeAlert() {
    rawImage = undefined
  }

  function previewCrop(e: any) {
    pixelCrop = e.detail.pixels
  }

  onMount(() => {
    isLoading = false
  })
</script>

<div
  class="imageContainer"
  bind:this={container}
  style="--color:{$Layout?.button?.background ??
    '#4c0708'};--minHeight: {minHeight};--width: {width};--height: {height};{type === TUploadablePhoto.PROFILE
    ? `border-radius: 50%;place-self:center;`
    : ''}"
>
  {#if isLoading && (type !== TUploadablePhoto.PROFILE || image)}
    <LocalLoading />
  {/if}
  {#if type === TUploadablePhoto.PROFILE && (!showImage || !image)}
    <div class="avatar">
      {`${name?.[0] ?? '-'}${lastName?.[0] ?? name?.[1] ?? '-'}`.toUpperCase()}
    </div>
  {:else}
    <img
      class={isLoading ? '' : ' show'}
      on:error={hideImage}
      on:load={imageLoaded}
      src={showImage && image
        ? image
        : type === TUploadablePhoto.VENDOR
        ? '/assets/icons/transparent-logo-1.svg'
        : '/assets/images/food-plate.svg'}
      alt={title ?? 'iKomida'}
    />
  {/if}
  <button
    style="--uploadLeft:{TUploadablePhoto.THUMB === type
      ? 0
      : 'calc(50% - 70px)'};--uploadWidth:{TUploadablePhoto.THUMB === type
      ? '100%'
      : '140px'};--uploadBottom:{TUploadablePhoto.THUMB === type
      ? -16
      : -45}px;--uploadHeight:{TUploadablePhoto.THUMB === type
      ? 'calc(100% + 16px)'
      : '70px'};--uploadBackgroundColor:{TUploadablePhoto.THUMB === type
      ? 'transparent'
      : '#00000077'};--uploadRadius:{TUploadablePhoto.THUMB === type ? '0' : '100%'};"
    class="upload"
    aria-label="upload"
    on:click={openFileSelector}
  >
    <Fa
      style="
    font-size: {TUploadablePhoto.THUMB === type ? 0.8 : 1.7}em;
    margin-bottom: {TUploadablePhoto.THUMB === type ? -43 : 35}px;"
      icon={faCamera}
    />
    <input
      style="display:none"
      type="file"
      on:change={onFileSelected}
      bind:this={fileinput}
      accept="image/jpeg, image/png"
    />
  </button>
</div>
<small>Dimensões da imagem: {cropWidth}px {cropHeight}px</small>
{#if rawImage}
  <Alert
    title="Editar foto"
    closeCallBack={closeAlert}
    buttons={[
      { name: 'Cancelar', callback: closeAlert, principal: false },
      { name: 'OK', callback: cropImage, principal: true }
    ]}
    ><div
      class="imageContainer"
      style="--color:{$Layout?.button?.background ??
        '#4c0708'};--width: {cropWidthString};--minHeight: {minHeight};--height: {cropHeightString};{type ===
      TUploadablePhoto.PROFILE
        ? `border-radius: 50%;place-self:center;`
        : ''}"
    >
      <Cropper
        cropShape="round"
        {rawImage}
        minZoom={1}
        maxZoom={5}
        bind:cropSize
        bind:crop
        bind:zoom
        on:cropcomplete={previewCrop}
        aspect={1}
      />
    </div>
  </Alert>
{/if}

<style>
  .imageContainer {
    position: relative;
    border-radius: 4px;
    width: var(--width);
    max-width: 500px;
    background: #ccc;
    overflow: hidden;
    place-content: center;
    align-items: center;
    display: flex;
    height: var(--height);
    min-height: var(--height);
    max-height: 500px;
    align-self: center;
    color: var(--color);
  }
  .imageContainer > .avatar {
    font-size: 4em;
    font-family: RobotoBold;
  }
  .imageContainer > img {
    background: #ccc;
    width: 100%;
    max-width: 100%;
    object-fit: contain;
  }
  .imageContainer > img.show {
    display: flex;
    align-items: center;
    place-content: center;
  }
  .imageContainer > .upload {
    width: var(--uploadWidth);
    position: absolute;
    left: var(--uploadLeft);
    background: var(--uploadBackgroundColor);
    border-radius: var(--uploadRadius);
    overflow: hidden;
    bottom: var(--uploadBottom);
    height: var(--uploadHeight);
    place-content: center;
    display: flex;
    align-items: center;
    color: #fff;
  }
  small {
    text-align: center;
  }
  @media screen and (min-width: 500px) {
    .imageContainer {
      min-height: var(--minHeight);
    }
  }
</style>
