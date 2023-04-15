<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { required } from '@vuelidate/validators'
import { RFormInput, RButton } from '@routaa/ui-kit'
import $t from '@/composables/useTranslations'
import { $v, $vMsg } from '@/utils/validator'
import Address from './address.vue'
import ErrorsDisplay from '../ErrorsDisplay/index.vue'

const model = reactive({
  firstName: '',
  lastName: '',
  password: '',
  address: {
    zipCode: '',
    streetInfo: {
      province: ''
    }
  }
})

const rules = computed(() => {
  return {
    firstName: { required: $vMsg('required', required, $t('shared.firstName')) },
    lastName: { required: $vMsg('required', required, $t('shared.lastName')) },
    password: { required: $vMsg('required', required, $t('shared.pageNotFound')) },
    address: {
      zipCode: { required: $vMsg('required', required, $t('shared.name')) },
      streetInfo: {
        province: { required: $vMsg('required', required, $t('shared.name')) }
      }
    }
  }
})

const v = $v(rules, model)

const submit = async () => {
  const proceed = await v.value.$validate()

  if (proceed) console.log('proceed true')
  else console.log('proceed true')
}
</script>

<template>
  <ErrorsDisplay :errors="v.$errors" class="mb-3" />

  <div>
    <div class="form-group">
      <label for="firstName">firstName</label>

      <RFormInput id="firstName" name="test" v-model="model.firstName" />
    </div>

    <div class="form-group">
      <label for="lastName">lastName</label>

      <RFormInput id="lastName" name="test" v-model="model.lastName" />
    </div>

    <Address v-model="model.address" />

    <RButton class="mt-3" @click="submit">submit</RButton>
  </div>
</template>
