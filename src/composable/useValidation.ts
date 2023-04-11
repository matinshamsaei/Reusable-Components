import { useI18n } from 'vue-i18n'
import type { ValidationRule } from '@vuelidate/core'
import { createI18nMessage } from '@vuelidate/validators'

export default function (validateName: string, rule: ValidationRule, path: string) {
  const { t } = useI18n()

  const options = { path }

  const withI18nMessage = createI18nMessage({
    t,
    messagePath: () => t(`shared.${validateName}`, options)
  })

  return withI18nMessage(rule)
}
