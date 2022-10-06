<script lang="ts">
  import Fa from 'svelte-fa'
  import { faCamera } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import LocalLoading from './LocalLoading.svelte'
  import { resizeImage } from '../Utils/Image'
  import { Layout as LayoutStore } from '../Stores'
  import TUploadablePhoto from '../Types/TUploadablePhoto'
  let Layout = LayoutStore.instance.store

  export let image: string | undefined
  export let title: string | undefined = undefined
  export let name: string | undefined = undefined
  export let lastName: string | undefined = undefined
  export let type: TUploadablePhoto | undefined = undefined
  let showImage = true
  let isLoading = true
  let height =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE].includes(type)
      ? 'calc(100vw - 40px)'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : '160px'
  let minHeight =
    !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE].includes(type)
      ? '500px'
      : type === TUploadablePhoto.PROFILE
      ? '210px'
      : type === TUploadablePhoto.THUMB
      ? '45px'
      : '160px'
  let fileinput: HTMLInputElement

  async function onFileSelected(event: any) {
    let imageFile = await event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = async (e: any) => {
      const [dataType] = e.target.result.split(';')
      let imageType = 'jpeg'
      switch (dataType) {
        case 'image/jpeg':
        case 'image/jpg':
          imageType = 'jpeg'
          break
        case 'image/png':
          imageType = 'png'
          break
      }
      const resizeHeight =
        !type || ![TUploadablePhoto.VENDOR, TUploadablePhoto.PROFILE].includes(type)
          ? 400
          : type === TUploadablePhoto.PROFILE
          ? 210
          : type === TUploadablePhoto.THUMB
          ? 45
          : 160
      image = await resizeImage(imageFile, 400, resizeHeight, imageType)
      showImage = true
    }
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
  onMount(() => {
    isLoading = false
  })
</script>

<div
  class="imageContainer"
  style="--color:{$Layout?.button?.background ?? '#4c0708'};--minHeight: {minHeight};--height: {height};{type ===
  TUploadablePhoto.PROFILE
    ? 'border-radius: 50%;width: 210px;place-self:center;'
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
    style="--uploadLeft:{TUploadablePhoto.THUMB === type ? 12 : 70}px;--uploadWidth:{TUploadablePhoto.THUMB === type
      ? 24
      : 140}px;--uploadBottom:{TUploadablePhoto.THUMB === type ? -16 : -45}px;--uploadHeight:{TUploadablePhoto.THUMB ===
    type
      ? 15
      : 70}px;"
    class="upload"
    aria-label="upload"
    on:click={openFileSelector}
  >
    <Fa
      style="
    font-size: {TUploadablePhoto.THUMB === type ? 0.8 : 1.7}em;
    margin-bottom: {TUploadablePhoto.THUMB === type ? 0 : 35}px;"
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

<style>
  .imageContainer {
    position: relative;
    border-radius: 4px;
    width: 100%;
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
    overflow: hidden;
  }
  .imageContainer > img.show {
    display: flex;
    align-items: center;
    place-content: center;
  }
  .imageContainer > .upload {
    width: var(--uploadWidth);
    position: absolute;
    left: calc(50% - var(--uploadLeft));
    background: #00000077;
    border-radius: 100%;
    overflow: hidden;
    bottom: var(--uploadBottom);
    height: var(--uploadHeight);
    place-content: center;
    display: flex;
    align-items: center;
    color: #fff;
  }
  @media screen and (min-width: 500px) {
    .imageContainer {
      min-height: var(--minHeight);
    }
  }
</style>
