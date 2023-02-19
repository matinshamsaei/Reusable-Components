export function mobileDeNormalizer(mobile: string) {
  if (!mobile) return null
  else if (mobile.startsWith('+98')) return `0${mobile.substr(3)}`
  else if (mobile.startsWith('0098')) return `0${mobile.substr(4)}`
  else if (mobile.startsWith('0')) return mobile
  else if (mobile.startsWith('9')) return `0${mobile}`
  else return mobile
}
