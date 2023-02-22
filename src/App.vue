<template>
  <div class="container my-5">
    <RFormInput v-model="email" name="email" placeholder="email" class="mb-3" />
    <RFormInput v-model="password" type="password" name="password" placeholder="password" />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { RFormInput } from '@routaa/ui-kit'

const email = ref('')
const password = ref('')

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8)
})

const { handleSubmit } = useForm({
  validationSchema: schema
})
</script>
