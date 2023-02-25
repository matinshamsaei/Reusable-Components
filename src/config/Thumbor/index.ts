import { AppConfig, type Config } from '../App'
import BaseConfig from '../Base'
import {extendConfig} from '../Extend'


type ThumborOptions = {
  src?: string
  prefixUrl?: string
  format?: string
  watermark?: string
  gif?: boolean
  effects?: object
  fitIn?: boolean
  width?: string | number
  height?: string | number
}

type HorizontalAlign = 'left' | 'right'
type VerticalAlign = 'bottom' | 'top'

type WaterMarkConfig = {
  enabled: boolean
  imageUrl: string
  opacity: number
  margin: number
  horizontalAlign: HorizontalAlign
  verticalAlign: VerticalAlign
}

export interface ThumborFactory {
  createUrl(options: ThumborOptions): string | null
}

export class Thumbor implements ThumborFactory {
  config: Config = AppConfig
  files = { ...AppConfig.files, ...extendConfig.files }
  enabled: boolean = !!this.files.thumbServer
  url: string = this.files.thumbServerUrl
  horizontalAlign: HorizontalAlign | null = null
  verticalAlign: VerticalAlign | null = null
  watermarkConfig: WaterMarkConfig

  constructor() {
    this.watermarkConfig = {
      enabled: !!this.files.watermarkUrl,
      imageUrl: this.files.watermarkUrl,
      opacity: 50,
      margin: 50,
      horizontalAlign: 'left', // left | right
      verticalAlign: 'bottom' // bottom | top
    }
  }

  horizontalMargin() {
    if (this.watermarkConfig.horizontalAlign === 'left') return this.watermarkConfig.margin
    return -this.watermarkConfig.margin
  }

  verticalMargin() {
    if (this.watermarkConfig.verticalAlign === 'top') return this.watermarkConfig.margin
    return -this.watermarkConfig.margin
  }

  createUrl(options: ThumborOptions): string | null {
    if (!options || !options.src) return null
    const urlParts = [this.url]

    // Add Size And Crop Config
    const cropUrl = this.crop(options)
    if (cropUrl) urlParts.push(cropUrl)

    // Add Format And Effects And Watermark Config
    const filtersUrl = this.filters(options)
    if (filtersUrl) urlParts.push(filtersUrl)

    // Add Image Orginal Src Config
    let imageSrc = options.src
    if (options.prefixUrl) imageSrc = `${options.prefixUrl}/${imageSrc}`
    else if (BaseConfig.prefixUrl) imageSrc = `${BaseConfig.prefixUrl}/${imageSrc}`
    urlParts.push(imageSrc)

    return urlParts.join('/')
  }

  filters(options: ThumborOptions): string | null {
    const { format, watermark, gif, effects } = options
    const filtersUrl = ['filters']

    if (format) {
      if (gif) filtersUrl.push(`gifv(${format})`)
      else filtersUrl.push(`format(${format})`)
    }

    if (effects && Object.keys(effects).length) {
      Object.entries(effects).forEach(([key, value]) => {
        filtersUrl.push(`${key}(${value})`)
      })
    }

    if (watermark && this.watermark) {
      filtersUrl.push(this.watermark)
    }

    if (filtersUrl.length === 1) return null
    return filtersUrl.join(':')
  }

  get watermark() {
    const { enabled, opacity, imageUrl } = this.watermarkConfig
    if (!enabled) return null

    return `watermark(${imageUrl}, ${this.horizontalMargin()}, ${this.verticalMargin()}, ${opacity})`
  }

  crop(options: ThumborOptions): string {
    const { fitIn, width, height } = options
    const urlParts = []
    if (fitIn) urlParts.push('fit-in')
    if (width && height) urlParts.push(`${width}x${height}`)
    if (this.horizontalAlign) urlParts.push(this.horizontalAlign)
    if (this.verticalAlign) urlParts.push(this.verticalAlign)

    return urlParts.join('/')
  }
}

export default new Thumbor()
