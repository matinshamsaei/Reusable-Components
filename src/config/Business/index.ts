export default {
  name: 'روتا',
  enName: 'routaa',
  coordinate: {
    lat: '35.7256707',
    lng: '51.5447374'
  },
  telephone: '+982196647',
  email: 'info@Routaa.com',
  currency: 'IRR',
  socialMedia: {
    instagram: 'https://www.instagram.com/routaa',
    linkedin: 'https://www.linkedin.com/company/routaa',
    aparat: 'https://www.aparat.com/routaa',
    twitter: 'https://twitter.com/routaa',
    youtube: 'https://www.youtube.com/channel/UCUAxcreumfGopv6L1jtDlrA',
    telegram: 'https://t.me/routaa',
    facebook: 'https://www.facebook.com/394494481063648'
  },
  all(): string[] {
    return Object.values(this.socialMedia)
  }
}
