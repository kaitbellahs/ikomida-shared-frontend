<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import type CropSize from '../Types/CropSize'
  import TCropShape from '../Types/TCropShape'
  import * as helpers from '../Utils/Crop'

  export let rawImage: string | undefined
  export let crop = { x: 0, y: 0 }
  export let zoom = 1
  export let aspect = 4 / 3
  export let minZoom = 1
  export let maxZoom = 3
  export let cropSize: CropSize | undefined = undefined
  export let cropShape = TCropShape.RECT
  export let showGrid = true
  export let zoomSpeed = 1
  export let crossOrigin: string | undefined = undefined
  export let restrictPosition = true

  const dispatch = createEventDispatcher()

  let cropperSize: CropSize | undefined = undefined
  let imageSize: helpers.IImageSize = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 }
  let containerEl: HTMLDivElement | undefined = undefined
  let containerRect: DOMRect | undefined = undefined
  let imageElement: HTMLImageElement | undefined = undefined
  let dragStartPosition = { x: 0, y: 0 }
  let dragStartCrop = { x: 0, y: 0 }
  let lastPinchDistance = 0
  let rafDragTimeout: number | undefined = undefined
  let rafZoomTimeout: number | undefined = undefined

  onMount(() => {
    if (imageElement && imageElement.complete) {
      onImgLoad()
    }
  })

  onDestroy(() => {
    cleanEvents()
  })

  const cleanEvents = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onDragStopped)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onDragStopped)
  }

  const onImgLoad = () => {
    computeSizes()
    emitCropData()
    computeZoom()
  }

  const getAspect = () => {
    if (containerEl) {
      return (containerEl.parentElement?.clientWidth ?? 0) / (containerEl.parentElement?.clientHeight ?? 0)
    }
    return aspect
  }

  const computeSizes = () => {
    if (imageElement) {
      imageSize = {
        width: imageElement.width,
        height: imageElement.height,
        naturalWidth: imageElement.naturalWidth,
        naturalHeight: imageElement.naturalHeight
      }
      cropperSize = cropSize ? cropSize : helpers.getCropSize(imageElement.width, imageElement.height, aspect)
    }
    if (containerEl) {
      containerRect = containerEl.getBoundingClientRect()
    }
  }
  const computeZoom = () => {
    if (imageSize && containerRect) {
      if (imageSize.width <= imageSize.height && imageSize.width < containerRect.width) {
        zoom = containerRect.width / imageSize.width
        maxZoom = maxZoom + zoom
      } else if (imageSize.height <= imageSize.width && imageSize.height < containerRect.height) {
        zoom = containerRect.height / imageSize.height
        maxZoom = maxZoom + zoom
      }
    }
    console.log('containerRect:', containerRect)
  }

  const getMousePoint = (e: MouseEvent) => ({ x: Number(e.clientX), y: Number(e.clientY) })

  const getTouchPoint = (touch: Touch) => ({
    x: Number(touch.clientX),
    y: Number(touch.clientY)
  })

  const onMouseDown = (e: MouseEvent) => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onDragStopped)
    onDragStart(getMousePoint(e))
  }

  const onMouseMove = (e: MouseEvent) => onDrag(getMousePoint(e))

  const onTouchStart = (e: TouchEvent) => {
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onDragStopped)

    if (e.touches.length === 2) {
      onPinchStart(e)
    } else if (e.touches.length === 1) {
      onDragStart(getTouchPoint(e.touches[0]))
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2) {
      onPinchMove(e)
    } else if (e.touches.length === 1) {
      onDrag(getTouchPoint(e.touches[0]))
    }
  }

  const onDragStart = ({ x, y }: helpers.IPoint) => {
    dragStartPosition = { x, y }
    dragStartCrop = { x: crop.x, y: crop.y }
  }

  const onDrag = ({ x, y }: helpers.IPoint) => {
    if (rafDragTimeout) window.cancelAnimationFrame(rafDragTimeout)

    rafDragTimeout = window.requestAnimationFrame(() => {
      if (x === undefined || y === undefined) return
      const offsetX = x - dragStartPosition.x
      const offsetY = y - dragStartPosition.y
      const requestedPosition = {
        x: dragStartCrop.x + offsetX,
        y: dragStartCrop.y + offsetY
      }

      crop =
        restrictPosition && cropperSize
          ? helpers.restrictPosition(requestedPosition, imageSize, cropperSize, zoom)
          : requestedPosition
    })
  }

  const onDragStopped = () => {
    cleanEvents()
    emitCropData()
  }

  const onPinchStart = (e: TouchEvent) => {
    const pointA = getTouchPoint(e.touches[0])
    const pointB = getTouchPoint(e.touches[1])
    lastPinchDistance = helpers.getDistanceBetweenPoints(pointA, pointB)
    onDragStart(helpers.getCenter(pointA, pointB))
  }

  const onPinchMove = (e: TouchEvent) => {
    const pointA = getTouchPoint(e.touches[0])
    const pointB = getTouchPoint(e.touches[1])
    const center = helpers.getCenter(pointA, pointB)
    onDrag(center)

    if (rafZoomTimeout) window.cancelAnimationFrame(rafZoomTimeout)
    rafZoomTimeout = window.requestAnimationFrame(() => {
      const distance = helpers.getDistanceBetweenPoints(pointA, pointB)
      const newZoom = zoom * (distance / lastPinchDistance)
      setNewZoom(newZoom, center)
      lastPinchDistance = distance
    })
  }

  const onWheel = (e: WheelEvent) => {
    const point = getMousePoint(e)
    const newZoom = zoom - (e.deltaY * zoomSpeed) / 200
    setNewZoom(newZoom, point)
  }

  const getPointOnContainer = ({ x, y }: helpers.IPoint) => {
    if (!containerRect) {
      //TODO: report error
      throw new Error('The Cropper is not mounted')
    }
    return {
      x: containerRect.width / 2 - (x - containerRect.left),
      y: containerRect.height / 2 - (y - containerRect.top)
    }
  }

  const getPointOnImage = ({ x, y }: helpers.IPoint) => ({
    x: (x + crop.x) / zoom,
    y: (y + crop.y) / zoom
  })

  const setNewZoom = (newZoom: number, point: helpers.IPoint) => {
    const zoomPoint = getPointOnContainer(point)
    const zoomTarget = getPointOnImage(zoomPoint)
    zoom = Math.min(maxZoom, Math.max(newZoom, minZoom))

    const requestedPosition = {
      x: zoomTarget.x * zoom - zoomPoint.x,
      y: zoomTarget.y * zoom - zoomPoint.y
    }
    crop =
      restrictPosition && cropperSize
        ? helpers.restrictPosition(requestedPosition, imageSize, cropperSize, zoom)
        : requestedPosition
  }

  const emitCropData = () => {
    if (!cropperSize || cropperSize.width === 0) return
    const position = restrictPosition ? helpers.restrictPosition(crop, imageSize, cropperSize, zoom) : crop
    const { croppedAreaPercentages, croppedAreaPixels } = helpers.computeCroppedArea(
      position,
      imageSize,
      cropperSize,
      getAspect(),
      zoom,
      restrictPosition
    )

    dispatch('cropcomplete', {
      percent: croppedAreaPercentages,
      pixels: croppedAreaPixels
    })
  }

  $: if (imageElement) {
    cropperSize = cropSize ? cropSize : helpers.getCropSize(imageElement.width, imageElement.height, aspect)
  }

  $: zoom && emitCropData()
</script>

<svelte:window on:resize={computeSizes} />
<div
  class="container"
  bind:this={containerEl}
  on:mousedown|preventDefault={onMouseDown}
  on:touchstart|preventDefault={onTouchStart}
  on:wheel|preventDefault={onWheel}
  data-testid="container"
>
  <img
    bind:this={imageElement}
    class="image"
    src={rawImage}
    on:load={onImgLoad}
    alt=""
    style="transform: translate({crop.x}px, {crop.y}px) scale({zoom});"
    crossorigin={crossOrigin}
  />
  {#if cropperSize}
    <div
      class="cropperArea"
      class:round={cropShape === TCropShape.ROUND}
      class:grid={showGrid}
      style="width: {cropperSize.width}px; height: {cropperSize.height}px;"
      data-testid="cropper"
    />
  {/if}
</div>

<style>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    user-select: none;
    touch-action: none;
    cursor: move;
  }

  .image {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    will-change: transform;
  }

  .cropperArea {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4pt 8pt #0000009e;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.5);
    border: 1pt solid rgba(255, 255, 255, 0.5);
    overflow: hidden;
  }

  .grid:before {
    content: ' ';
    box-sizing: border-box;
    border: 1pt solid rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 33.33%;
    right: 33.33%;
    border-top: 0;
    border-bottom: 0;
  }

  .grid:after {
    content: ' ';
    box-sizing: border-box;
    border: 1pt solid rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 33.33%;
    bottom: 33.33%;
    left: 0;
    right: 0;
    border-left: 0;
    border-right: 0;
  }

  .round {
    border-radius: 50%;
  }
</style>
