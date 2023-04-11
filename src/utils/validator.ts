import { useI18n } from 'vue-i18n'
import { useVuelidate, type ValidationRule } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { createI18nMessage } from '@vuelidate/validators'

export function $v(rules: object, model: object) {
  const $v = useVuelidate(rules, model, { $lazy: true, $autoDirty: true })

  return $v
}

export function $vMsg(validateName: string, rule: ValidationRule, path: string, isCustomValidate: boolean = false) {
  const options = { path }
  const { t } = useI18n()

  if (isCustomValidate) return helpers.withMessage(t(`validations.${validateName}`, options), rule)
  else {
    const withI18nMessage = createI18nMessage({
      t,
      messagePath: () => t(`validations.${validateName}`, options)
    })

    return withI18nMessage(rule)
  }
}
