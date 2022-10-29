import type { CropSize } from '../Types'

export interface IPoint {
  x: number
  y: number
}
export interface IImageSize {
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
}

export function getCropSize(width: number, height: number, aspect: number) {
  if (width >= height * aspect) {
    return {
      width: height * aspect,
      height
    }
  }
  return {
    width,
    height: width / aspect
  }
}

export function restrictPosition(position: IPoint, size: IImageSize, cropSize: CropSize, zoom: number) {
  return {
    x: restrictPositionCoord(position.x, size.width, cropSize.width, zoom),
    y: restrictPositionCoord(position.y, size.height, cropSize.height, zoom)
  }
}

function restrictPositionCoord(position: number, size: number, cropSize: number, zoom: number) {
  const maxPosition = (size * zoom) / 2 - cropSize / 2
  return Math.min(maxPosition, Math.max(position, -maxPosition))
}

export function getDistanceBetweenPoints(pointA: IPoint, pointB: IPoint) {
  return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2))
}

export function computeCroppedArea(
  crop: IPoint,
  size: IImageSize,
  cropSize: CropSize,
  aspect: number,
  zoom: number,
  restrictPosition = true
) {
  const limitAreaFn = restrictPosition ? limitArea : noOp
  const croppedAreaPercentages = {
    x: limitAreaFn(100, (((size.width - cropSize.width / zoom) / 2 - crop.x / zoom) / size.width) * 100),
    y: limitAreaFn(100, (((size.height - cropSize.height / zoom) / 2 - crop.y / zoom) / size.height) * 100),
    width: limitAreaFn(100, ((cropSize.width / size.width) * 100) / zoom),
    height: limitAreaFn(100, ((cropSize.height / size.height) * 100) / zoom)
  }

  const widthInPixels = limitAreaFn(size.naturalWidth, (croppedAreaPercentages.width * size.naturalWidth) / 100, true)
  const heightInPixels = limitAreaFn(
    size.naturalHeight,
    (croppedAreaPercentages.height * size.naturalHeight) / 100,
    true
  )
  const isImgWiderThanHigh = size.naturalWidth >= size.naturalHeight * aspect
  const sizePixels = isImgWiderThanHigh
    ? {
        width: Math.round(heightInPixels * aspect),
        height: heightInPixels
      }
    : {
        width: widthInPixels,
        height: Math.round(widthInPixels / aspect)
      }
  const croppedAreaPixels = {
    ...sizePixels,
    x: limitAreaFn(size.naturalWidth - sizePixels.width, (croppedAreaPercentages.x * size.naturalWidth) / 100, true),
    y: limitAreaFn(size.naturalHeight - sizePixels.height, (croppedAreaPercentages.y * size.naturalHeight) / 100, true)
  }
  return { croppedAreaPercentages, croppedAreaPixels }
}

function limitArea(max: number, value: number, shouldRound = false) {
  const v = shouldRound ? Math.round(value) : value
  return Math.min(max, Math.max(0, v))
}

function noOp(max: number, value: number) {
  return value
}

export function getCenter(a: IPoint, b: IPoint) {
  return {
    x: (b.x + a.x) / 2,
    y: (b.y + a.y) / 2
  }
}
