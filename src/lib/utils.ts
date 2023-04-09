import type { SetupContext } from 'vue'

export function convertNumbers2English(str: string): string | number | null {
  if (!str) return null
  return str.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (c) {
    return c.charCodeAt(0) & 0xf
  })
}

export interface IObject {
  [key: string]: any
}

export function serializer(obj: IObject): string {
  return Object.keys(obj)
    .reduce((a: string[], k: string) => {
      let val = obj[k]
      if (val !== null && typeof val === 'object') {
        val = JSON.stringify(val)
      }
      a.push(k + '=' + encodeURIComponent(val))
      return a
    }, [])
    .join('&')
}

export function attrsPartitioner(attrs: SetupContext['attrs']) {
  const onRE = /^on[^a-z]/
  const attributes: IObject = {}
  const listeners: IObject = {}

  for (const property in attrs) {
    if (onRE.test(property)) listeners[property] = attrs[property]
    else attributes[property] = attrs[property]
  }

  return { attributes, listeners }
}

export function isEmptyObj(data: IObject) {
  return Object.values(data).every((x) => x === null || x === '')
}
