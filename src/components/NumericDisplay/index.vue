<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  value?: number
  direction?: string
  showAppend?: boolean
  showSeparated?: boolean
  append?: string
  label?: string
  labelClass?: object | string
  amountClass?: object | string
  appendClass?: object | string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'ltr',
  showAppend: true,
  showSeparated: true
})

const amount = computed(() => {
  if (!props.showSeparated) return props.value
  else if (props.value !== null) return props.value?.toLocaleString()
  else return null
})

const isInfinity = computed(() => {
  return props.value === 2147483647
})
</script>

<template>
  <span>
    <span v-if="props.label" class="d-inline-block" :class="labelClass">
      {{ props.label }}
    </span>

    <font-awesome-icon id="infinity-icon" v-if="isInfinity" icon="infinity" class="text-muted align-middle" />

    <span v-else>
      <span :dir="props.direction" :class="amountClass">{{ amount }}</span>

      <span v-if="props.showAppend && props.append" :class="appendClass"> {{ props.append }}</span>
    </span>
  </span>
</template>
