import { type Config } from './index'

export default {
  files: {
    thumbServer: 'img.routaa.com/unsafe',
    staticServer: 'static.routaa.com',
    noImageUrl: 'https://img.routaa.com/unsafe/global/files/noimage.png',
    watermarkUrl: 'https://routaa.com/img/watermark.png'
  },
  apiServer: 'api.business.routaa.com',
  userManagementServer: 'api.user-mgmt.routaa.com',
  engineServer: 'api.engine.routaa.com',
  paymentServer: 'api.payment.routaa.com',
  websiteUrl: 'https://business.routaa.com',
  map: {
    rtlUrl: 'https://map.routaa.com/routaa-map/routaa-rtl/routaa-rtl.js',
    styleUrl: 'https://api.engine.routaa.com/api/pub/map/style/streets-pwa-v4',
    apiKey: 'yuTp9zRPD5m9kSXSJQCSVXPppOrNA'
  },
  ssl: true
} as Config
