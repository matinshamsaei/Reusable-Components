<script setup lang="ts">
import { RAlert } from '@routaa/ui-kit'
import { computed } from 'vue'
import type { IObject } from '../../utils/object'
import { isEmptyObj } from '../../lib/utils'

type Props = {
  errors: string[] | IObject | object | object[]
  extraErrors?: string[] | object[] | IObject
}

const props = defineProps<Props>()

const show = computed(() => {
  const hasArrayOfErrors = Array.isArray(props.errors) && props.errors.length
  const hasObjectOfErrors =
    typeof props.errors === 'object' && !Array.isArray(props.errors) && !isEmptyObj(props.errors)

  if (hasArrayOfErrors || hasObjectOfErrors) return true
  return false
})
</script>

<template>
  <RAlert v-model="show" id="errors" variant="danger" class="px-4">
    <ul class="m-0 px-1">
      <li v-if="$slots.first"><slot name="first"></slot></li>

      <li v-for="err in props.errors" :key="err.$uid">
        <span v-if="typeof err === 'object'" v-html="err.$message" />

        <span v-else v-html="err" />
      </li>

      <template v-if="props.extraErrors?.length">
        <li v-for="err in extraErrors">
          <span v-if="typeof err === 'object'" v-html="err?.$message" />

          <span v-else v-html="err" />
        </li>
      </template>

      <li v-if="$slots.last"><slot name="last"></slot></li>
    </ul>
  </RAlert>
</template>
