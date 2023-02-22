<script setup lang="ts">
import { RAlert } from '@routaa/ui-kit'
import { computed } from 'vue'

type Props = {
  value?: object[] | object
}

const props = defineProps<Props>()
</script>

<template>
  <pre>
        {{ props.value }}
    </pre
  >

  <!-- <RAlert :show="show" id="errors" variant="danger" class="px-4">
    <ul class="m-0 px-1">
      <li v-if="$slots.first"><slot name="first"></slot></li>

      <li v-for="err in errorItems.all(form)" :key="err" v-html="err" />

      <template v-if="extraErrors && extraErrors.length">
        <li v-for="err in extraErrors" :key="err" v-html="err" />
      </template>

      <li v-if="$slots.last"><slot name="last"></slot></li>
    </ul>
  </RAlert> -->
</template>
