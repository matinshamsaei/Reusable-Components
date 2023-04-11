<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { RFormInput, RButton } from '@routaa/ui-kit'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Address from './address.vue'
import $t from '@/composable/useTranslations'
import $validate from '@/composable/useValidation'

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

const mustBool = (value: any) => {
  return false
}

const rules = computed(() => {
  return {
    firstName: { required: $validate('required', required, $t('shared.firstName')), mustBool },
    lastName: { required: $validate('required', required, $t('shared.lastName')) },
    password: { required: $validate('required', required, $t('shared.pageNotFound')) },
    address: {
      zipCode: { required: $validate('required', required, $t('shared.name')) },
      streetInfo: {
        province: { required: $validate('required', required, $t('shared.name')) }
      }
    }
  }
})

const $v = useVuelidate(rules, model, { $lazy: true, $autoDirty: true })

const submit = async () => {
  const proceed = await $v.value.$validate()

  if (proceed) console.log('proceed true')
  else console.log('proceed true')
}
</script>

<template>
  <div v-for="item in $v.$errors" :key="item.$uid">
    {{ item.$message }}
  </div>

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
