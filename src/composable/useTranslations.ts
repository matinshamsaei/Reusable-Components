import { useI18n } from 'vue-i18n'

export default function (value: string) {
  const { t } = useI18n()

  return t(value)
}
