<script setup lang="ts">
import { RAlert } from '@routaa/ui-kit'
import { computed } from 'vue'
import type { IObject } from '../../utils/object'
import { isEmptyObj } from '../../lib/utils'

type Props = {
  errors: string[] | IObject | object
  extraErrors?: string[]
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true
})

const show = computed(() => {
  const hasArrayOfErrors = Array.isArray(props.errors) && props.errors.length
  const hasObjectOfErrors =
    typeof props.errors === 'object' && !Array.isArray(props.errors) && !isEmptyObj(props.errors)

  if ((hasArrayOfErrors || hasObjectOfErrors) && props.show) return true
  return false
})
</script>

<template>
  <div>show: {{ show }}</div>
  <div class="mt-4">errors:</div>
  <pre>{{ errors }}</pre>

  <RAlert v-model="show" id="errors" variant="danger" class="px-4">
    <ul class="m-0 px-1">
      <li v-if="$slots.first"><slot name="first"></slot></li>

      <li v-for="err in props.errors" :key="err" v-html="err" />

      <template v-if="props.extraErrors?.length">
        <li v-for="err in extraErrors" :key="err" v-html="err" />
      </template>

      <li v-if="$slots.last"><slot name="last"></slot></li>
    </ul>
  </RAlert>
</template>
