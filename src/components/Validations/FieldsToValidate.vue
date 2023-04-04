<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { reactive, inject } from 'vue'
import { RFormInput } from '@routaa/ui-kit'
import { AddValidatorKey } from '../../lib/formAggregator'

const digitsField = reactive(useField('digits', 'digits:3|required'))

const schema = { digits: 'digits' }

const { validate } = useForm({ validationSchema: schema })

const addValidator = inject(AddValidatorKey, () => {
  throw new Error('No aggregator provided for inject')
})
addValidator(validate)
</script>

<template>
  <RFormInput v-model="digitsField.value.value" name="digits" placeholder="digits" />
</template>
