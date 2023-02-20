import { AppConfig } from '../App'
import BaseConfig from '../Base'

const protocol = AppConfig.ssl ? 'https://' : 'http://'

type ExtendConfig = {
  protocol: string
  apiServerUrl: string
  userManagementServerUrl: string
  paymentServerUrl: string
  engineServerUrl: string
  files: {
    staticServerUrl: string
    thumbServerUrl: string
    createStaticUrl: Function
  }
}

export const extendConfig: ExtendConfig = {
  protocol,
  apiServerUrl: protocol + AppConfig.apiServer + '/api',
  userManagementServerUrl: protocol + AppConfig.userManagementServer + '/api',
  paymentServerUrl: protocol + AppConfig.paymentServer + '/api',
  engineServerUrl: protocol + AppConfig.engineServer + '/api',
  files: {
    staticServerUrl: protocol + AppConfig.files.staticServer,
    thumbServerUrl: protocol + AppConfig.files.thumbServer,
    createStaticUrl(supersedePrefix, src) {
      if (!!supersedePrefix) return `${AppConfig.files.thumbServerUrl}/${supersedePrefix}/${src}`
      return `${AppConfig.files.thumbServerUrl}/${BaseConfig.prefixUrl}/${src}`
    }
  }
}
