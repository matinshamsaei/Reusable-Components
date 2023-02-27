<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import ErrorsDisplay from './components/ErrorsDisplay/index.vue'
import { RFormInput } from '@routaa/ui-kit'
import { ref } from 'vue'

// Define a validation schema
const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8)
})

// Create a form context with the validation schema
const { errors, useFieldModel } = useForm({
  validationSchema: schema
})

const [email, password] = useFieldModel(['email', 'password'])
</script>

<template>
  <div class="container my-5">
    <ErrorsDisplay :errors="errors" :show="false" />

    <RFormInput v-model="email" name="email" placeholder="email" />
    <RFormInput v-model="password" name="password" placeholder="password" class="mt-3" />
  </div>
</template>
