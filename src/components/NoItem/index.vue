<script lang="ts" setup>
import { computed } from 'vue'
import useTranslations from '@/composable/useTranslations'

type Props = {
  title?: string
}

const props = defineProps<Props>()

const title = computed(() => {
  return props.title ? props.title : useTranslations('shared.noRecords')
})
</script>

<template>
  <div id="noItem" class="text-center py-3 text-muted">
    {{ title }}
  </div>
</template>
