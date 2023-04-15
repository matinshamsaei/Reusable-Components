import type { IObject } from '@/utils/object'

export function $isEmpty(value: string | IObject[] | []) {
  return value == null || value.length === 0
}
