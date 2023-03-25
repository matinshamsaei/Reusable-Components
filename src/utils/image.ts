export type ReturnGetSize = {
  width: number
  height: number
}

export type BlobType = {
  -readonly [K in keyof Blob]: Blob[K]
}

export type FileType = {
  -readonly [K in keyof File]: File[K]
}

export function getDataUrlFromFile(file: File): Promise<string | ArrayBuffer | null | undefined> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      resolve(event.target?.result)
    }
    reader.readAsDataURL(file)
  })
}

export function scaleImage(file: File, maxSize: number): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      const image = new Image()
      image.crossOrigin = 'Anonymous'

      image.onload = () => {
        const canvas = document.createElement('canvas')
        const { width, height } = getSize(image.width, image.height, maxSize)

        if (image.width > width || image.height > height) {
          canvas.width = width
          canvas.height = height

          canvas.getContext('2d')?.drawImage(image, 0, 0, width, height)
          const dataUrl = canvas.toDataURL(file.type)
          const blob = dataURLToBlob(dataUrl) as FileType

          // A Blob() is almost a File()
          // it's just missing the two properties below which we will add
          blob.lastModified = file.lastModified
          blob.name = file.name

          resolve(blob as File)
        } else {
          resolve(file)
        }
      }
      image.src = (typeof readerEvent.target?.result === 'string' && readerEvent.target?.result) || ''
    }
    reader.readAsDataURL(file)
  })
}

/* Utility function to get new size */
function getSize(w: number, h: number, maxSize: number): ReturnGetSize {
  if (w > h) {
    if (w > maxSize) {
      h *= maxSize / w
      w = maxSize
    }
  } else {
    if (h > maxSize) {
      w *= maxSize / h
      h = maxSize
    }
  }
  return {
    width: Math.round(w),
    height: Math.round(h)
  }
}

/* Utility function to convert a canvas to a BLOB */
function dataURLToBlob(dataURL: string): BlobType {
  const BASE64_MARKER = 'base64,'
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(',')
    const contentType = parts[0].split(':')[1]
    const raw = parts[1]

    return new Blob([raw], { type: contentType })
  }

  const parts = dataURL.split(BASE64_MARKER)
  const contentType = parts[0].split(':')[1]
  const raw = atob(parts[1])
  const rawLength = raw.length

  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], { type: contentType })
}

export function getMimeTypeExtension(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/bmp':
      return 'bmp'
    case 'image/tiff':
      return 'tif'
    case 'image/x-icon':
      return 'ico'
    case 'image/png':
    default:
      return 'png'
  }
}
