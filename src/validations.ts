import { defineRule } from 'vee-validate'
import { email, min, required, digits } from '@vee-validate/rules'

// vee validate rules
defineRule('email', email)
defineRule('digits', digits)
defineRule('required', (value: string, _, ctx) => {
  if (required(value)) return true

  return `${ctx.name} is required`
})

// custom rules
defineRule('password', (value: string) => {
  if (required(value) && min(value, { length: 8 })) return true

  return 'Password is not correct'
})
