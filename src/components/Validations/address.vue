<script lang="ts" setup>
import { RFormInput } from '@routaa/ui-kit'
import { computed } from 'vue'
import AddressInfo from './AddressInfo.vue'

type StreetInfo = {
  province: string
}

type Model = {
  zipCode: string
  streetInfo: StreetInfo
}

type Props = {
  modelValue: Model
}

interface Emit {
  (e: 'update:modelValue', val: any): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>

<template>
  <label for="zipCode">zipCode</label>

  <RFormInput id="zipCode" v-model="model.zipCode" />

  <AddressInfo v-model="props.modelValue.streetInfo.province" />
</template>
