import { type Config } from './index'

export default {
  files: {
    thumbServer: 'img.routaa.ir/unsafe',
    staticServer: 'routaa.ir',
    noImageUrl: 'https://img.routaa.ir/unsafe/global/files/noimage.png',
    watermarkUrl: 'https://routaa.ir/img/watermark.png'
  },
  apiServer: 'api.business.routaa.ir',
  userManagementServer: 'api.user-mgmt.routaa.ir',
  engineServer: 'api.engine.routaa.ir',
  paymentServer: 'api.payment.routaa.ir',
  websiteUrl: 'https://business.routaa.ir',
  map: {
    rtlUrl: 'https://map.routaa.ir/routaa-map/routaa-rtl/routaa-rtl.js',
    styleUrl: 'https://api.engine.routaa.ir/api/pub/map/style/streets-pwa-v4',
    apiKey: 'yuTp9zRPD5m9kSXSJQCSVXPppOrNA'
  }
} as Config
