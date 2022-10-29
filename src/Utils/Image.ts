export class Resizer {
  static changeHeightWidth(
    height: number,
    maxHeight: number,
    width: number,
    maxWidth: number,
    minWidth?: number,
    minHeight?: number
  ) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height)
      height = maxHeight
    }
    if (minWidth && width < minWidth) {
      height = Math.round((height * minWidth) / width)
      width = minWidth
    }
    if (minHeight && height < minHeight) {
      width = Math.round((width * minHeight) / height)
      height = minHeight
    }
    return { height, width }
  }

  static resizeAndRotateImage(
    image: CanvasImageSource,
    maxWidth: number,
    maxHeight: number,
    minWidth?: number,
    minHeight?: number,
    compressFormat = 'jpeg',
    quality = 100,
    rotation = 0
  ): string {
    const qualityDecimal = quality / 100
    const canvas = document.createElement('canvas')

    let width = image.width as number
    let height = image.height as number

    const newHeightWidth = this.changeHeightWidth(height, maxHeight, width, maxWidth, minWidth, minHeight)
    if (rotation && (rotation === 90 || rotation === 270)) {
      canvas.width = newHeightWidth.height
      canvas.height = newHeightWidth.width
    } else {
      canvas.width = newHeightWidth.width
      canvas.height = newHeightWidth.height
    }

    width = newHeightWidth.width
    height = newHeightWidth.height

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'
      ctx.fillRect(0, 0, width, height)
    }
    if (ctx && ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
      ctx.imageSmoothingQuality = 'high'
    }

    if (rotation) {
      ctx?.rotate((rotation * Math.PI) / 180)
      if (rotation === 90) {
        ctx?.translate(0, -canvas.width)
      } else if (rotation === 180) {
        ctx?.translate(-canvas.width, -canvas.height)
      } else if (rotation === 270) {
        ctx?.translate(-canvas.height, 0)
      } else if (rotation === 0 || rotation === 360) {
        ctx?.translate(0, 0)
      }
    }
    ctx?.drawImage(image, 0, 0, width, height)

    return canvas.toDataURL(`image/${compressFormat}`, qualityDecimal)
  }

  static b64toByteArrays(b64Data: string, contentType: string) {
    contentType = contentType || 'image/jpeg'
    const sliceSize = 512

    const byteCharacters = Buffer.from(b64Data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ''), 'base64')
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.subarray(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.at(i)
      }

      const byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }
    return byteArrays
  }

  static b64toBlob(b64Data: string, contentType: string) {
    const byteArrays = this.b64toByteArrays(b64Data, contentType)
    const blob = new Blob(byteArrays, { type: contentType, endings: 'transparent' })
    return blob
  }

  static b64toFile(b64Data: string, fileName: string, contentType: string) {
    const byteArrays = this.b64toByteArrays(b64Data, contentType)
    const file = new File(byteArrays, fileName, { type: contentType, endings: 'transparent' })
    return file
  }

  static createResizedImage(
    data: string,
    maxWidth: number,
    maxHeight: number,
    compressFormat: string,
    quality: number,
    rotation: number,
    responseUriFunc: (uri: string) => void,
    minWidth?: number,
    minHeight?: number
  ) {
    const image = new Image()
    image.src = data
    image.onload = function () {
      const resizedDataUrl: string = Resizer.resizeAndRotateImage(
        image,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        compressFormat,
        quality,
        rotation
      )
      responseUriFunc(resizedDataUrl)
    }
  }
}

export function resizeImage(data: string, maxWidth: any, maxHeight: any, imageType: any): Promise<string> {
  return new Promise(resolve => {
    Resizer.createResizedImage(data, maxWidth, maxHeight, imageType, 90, 0, (uri: string) => resolve(uri))
  })
}
