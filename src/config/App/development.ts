import { type Config } from './index'

export default {
  files: {
    thumbServer: '192.168.7.16:800/unsafe',
    staticServer: '192.168.7.16',
    noImageUrl: 'http://192.168.7.16:800/unsafe/global/files/noimage.png',
    watermarkUrl: 'http://localhost:8080/img/watermark.png'
  },
  apiServer: '192.168.7.16/business',
  userManagementServer: '192.168.7.16/user-mgmt',
  paymentServer: '192.168.7.16/payment',
  engineServer: '192.168.7.16/engine',
  websiteUrl: 'http://localhost:9191',
  map: {
    rtlUrl: 'http://192.168.7.16/routaa-map/routaa-rtl/routaa-rtl.js',
    styleUrl: 'http://192.168.7.16/engine/api/pub/map/style/streets-pwa-v4',
    apiKey: 'yuTp9zRPD5m9kSXSJQCSVXPppOrNA'
  }
} as Config
