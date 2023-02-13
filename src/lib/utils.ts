import { getCookie } from 'cookies-next'

function getLocalStorage(name) {
  if (window && window.localStorage) {
    let value = localStorage.getItem(name)
    if (value === null) return null

    const obj = JSON.parse(value)
    return obj.value
  } else return false
}

export function setLocaleFromStorageOrCookie() {
  let locale = getLocalStorage('locale')

  if (!locale) locale = getCookie('locale')

  if (!locale) locale = 'fa'

  return locale
}
