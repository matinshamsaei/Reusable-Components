import { AppConfig } from './App'
import BaseConfig from './Base'
import BusinessConfig from './Business'
import { extendConfig } from './Extend'
import SEOConfig from './SEO'
import ThumborConfig from './Thumbor'
import { deepMerge } from '../utils/object'

const mergedConfigs = {
  ...deepMerge(AppConfig, extendConfig),
  ...BaseConfig,
  ...BusinessConfig,
  ...SEOConfig,
  thumbor: ThumborConfig
}

export const appLogosUrl = {
  mainLogoUrl: (w = 256, h = 256) => {
    return mergedConfigs.thumbor.createUrl({
      fitIn: true,
      width: w,
      height: h,
      src: 'docs/media/branding/admin/logo.png'
    })
  },
  secondaryLogoUrl: (w = 256, h = 256) => {
    return mergedConfigs.thumbor.createUrl({
      fitIn: true,
      width: w,
      height: h,
      src: 'docs/media/branding/admin/logo-circle.png'
    })
  }
}

const businessImage = {
  structuredInfo: {
    business: {
      image: appLogosUrl.mainLogoUrl(512, 512)
    }
  }
}

export default {
  ...appLogosUrl,
  ...deepMerge(mergedConfigs, businessImage)
}
