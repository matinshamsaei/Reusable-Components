import { useI18n } from 'vue-i18n'

export default function (value: string, plural: number = 0, option: object = {}) {
  const { t } = useI18n()

  return t(value, plural, option)
}
