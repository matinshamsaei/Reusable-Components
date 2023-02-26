import Business from '../Business'

export default {
  structuredInfo: {
    business: {
      name: `${Business.name} - ${Business.enName}`,
      coordinate: Business.coordinate
    },
    currency: Business.currency,
    telephone: Business.telephone,
    email: Business.email,
    address: {
      streetAddress: 'PGGW+74 Tehran, Tehran Province, Iran',
      addressLocality: 'Tehran',
      addressCountry: 'IRAN',
      addressRegion: 'IR',
      postalCode: '1654997313'
    },
    workTime: {
      openingHours: 'Mo, Tu, We, Th, Fr, Sa, Su 09:00-18:00',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00'
    },
    socialMedia: Business.all()
  }
}
