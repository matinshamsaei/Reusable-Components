<script setup lang="ts">
import { RFormInput, RButton } from '@routaa/ui-kit'
import ErrorsDisplay from './components/ErrorsDisplay/index.vue'
import { useForm, useField } from 'vee-validate'
import { reactive } from 'vue'

const { errors, validate } = useForm()
const emailField = reactive(useField('email', 'email|required'))
const passwordField = reactive(useField('password', 'password'))
</script>

<script setup lang="ts">
</script>

<template>
  <div class="container my-5">
    <ErrorsDisplay :errors="errors" class="mb-3" />

    <RFormInput v-model="emailField.value.value" name="email" placeholder="email" />

    <RFormInput v-model="passwordField.value.value" name="password" placeholder="password" class="my-3" />

    <RButton @click="validate" block>submit</RButton>
  </div>
</template>
