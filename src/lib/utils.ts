export function convertNumbers2English(str: string): string | number {
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