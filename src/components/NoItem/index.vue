<script lang="ts" setup>
import { computed } from 'vue'
import $t from '@/composables/useTranslations'

type Props = {
  title?: string
}

const props = defineProps<Props>()

const title = computed(() => {
  return props.title ? props.title : $t('shared.noRecords')
})
</script>

<template>
  <div id="noItem" class="text-center py-3 text-muted">
    {{ title }}
  </div>
</template>
