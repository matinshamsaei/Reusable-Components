<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RButton } from '@routaa/ui-kit'
import CExcel from '../CExcel/index.vue'
import Download from '../Icons/Download.vue'

type Props = {
  data: object[]
  count: string | number
  fields: object // the keys of field would be keys of final excel which their values founded from data array
  header?: string
  getExcel?: Function
  stringifyLongNum?: boolean
  progressing?: boolean
  name?: string
  variant?: string
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  classes?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  header: 'shared.reportDate',
  stringifyLongNum: false,
  name: 'export_excel',
  variant: 'success',
  size: 'md',
  icon: 'download'
})

const { t } = useI18n()

const show = computed<boolean>(() => {
  return !!props.count
})

const fileName = computed<string>(() => {
  const now: string = new Date().toLocaleDateString()
  return `${props.name}_${now}.xls`
})

const date = computed<string>(() => {
  return new Date().toLocaleDateString()
})

const excelHeader = computed<string>(() => {
  const header = props.header ? props.header : ''
  return `${t(header)} - ${t('shared.reportDate')}: ${date.value}`
})

function getItems() {
  if (typeof props.getExcel === 'function') return props.getExcel()
  else return props.data
}
</script>

<template>
  <CExcel
    v-if="show"
    type="xls"
    :name="fileName"
    :fields="fields"
    :fetch="getItems"
    :header="excelHeader"
    :stringifyLongNum="stringifyLongNum"
  >
    <RButton :disabled="progressing" :class="classes" :size="size" :variant="variant">
      <Download class="me-1 align-middle" />

      {{ $t('shared.excelExport') }}
    </RButton>
  </CExcel>
</template>
