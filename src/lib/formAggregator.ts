import { provide, ref } from 'vue'
import type { InjectionKey } from 'vue'

type ValidatorMethodType = () => Promise<{ valid: boolean }>

export const AddValidatorKey: InjectionKey<(validator: ValidatorMethodType) => void> = Symbol('AddValidatorKey')

export function useValidationAggregator() {
  const validators = ref<ValidatorMethodType[]>([])

  // used by components to add validators to the array
  const register = (validator: ValidatorMethodType) => {
    validators.value.push(validator)
  }

  // provide this aggregator to components
  provide(AddValidatorKey, register)

  // run all validators
  const validateAll = async () => {
    return Promise.all(validators.value.map((v) => v()))
  }

  return {
    validateAll,
    register
  }
}
