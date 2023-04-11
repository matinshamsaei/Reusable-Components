<script lang="ts" setup>
import { RFormInput } from '@routaa/ui-kit'
import { useVuelidate } from '@vuelidate/core'
import { computed } from 'vue'

type Props = {
  modelValue: string
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
  <label for="province">province</label>

  <RFormInput id="province" v-model="model" />
</template>
