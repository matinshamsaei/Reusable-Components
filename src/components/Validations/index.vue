<script setup lang="ts">
import { RFormInput, RButton } from '@routaa/ui-kit'
import ErrorsDisplay from '../ErrorsDisplay/index.vue'
import FieldsToValidate from './FieldsToValidate.vue'
import { useForm, useField } from 'vee-validate'
import { reactive, ref } from 'vue'
import { useValidationAggregator } from '@/lib/formAggregator'

const { errors, validate } = useForm()
const emailField = reactive(useField('email', 'email|required'))
const passwordField = reactive(useField('password', 'password'))

const { validateAll, register } = useValidationAggregator()

const submit = async () => {
  register(validate) // to validate this component validations
  const results = await validateAll() // validate nested validations
  if (results.some((r) => !r.valid)) return

  // todo: post form or whatever you need after validation passes
  // ex: post api request
}
</script>

<template>
  <div class="container my-5">
    <ErrorsDisplay :errors="errors" class="mb-3" />

    <RFormInput v-model="emailField.value.value" name="email" placeholder="email" />

    <RFormInput v-model="passwordField.value.value" name="password" placeholder="password" class="my-3" />

    <FieldsToValidate />

    <RButton @click="submit" type="submit" block class="mt-3">submit</RButton>
  </div>
</template>
