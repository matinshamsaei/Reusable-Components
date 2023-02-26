import development from './development'
import production from './production'
import qaTest from './qa-test'
import staging from './staging'

export type Config = {
  files: {
    thumbServer: string
    staticServer: string
    noImageUrl: string
    watermarkUrl: string
  }
  apiServer: string
  userManagementServer: string
  paymentServer: string
  engineServer: string
  websiteUrl: string
  map: {
    rtlUrl: string
    styleUrl: string
    apiKey?: 'yuTp9zRPD5m9kSXSJQCSVXPppOrNA+IQoMwZbnFUXO0' | string
  }
  ssl?: false | boolean
}

const process = process.env.NODE_ENV

function exposeConfig(process) {
  if (process === 'development') return development
  else if (process === 'production') return development
  else if (process === 'qa-test') return development
  else return staging
}

export const AppConfig: Config = exposeConfig(process)
