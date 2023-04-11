import { useI18n } from 'vue-i18n'
import { useVuelidate, type ValidationRule, type Validation } from '@vuelidate/core'
import { createI18nMessage } from '@vuelidate/validators'

export function $vMsg(validateName: string, rule: ValidationRule, path: string) {
  const { t } = useI18n()

  const options = { path }

  const withI18nMessage = createI18nMessage({
    t,
    messagePath: () => t(`shared.${validateName}`, options)
  })

  return withI18nMessage(rule)
}

export function $v(rules: object, model: object) {
  const $v = useVuelidate(rules, model, { $lazy: true, $autoDirty: true })

  return $v
}
