<template>
  <div>
    <RInputGroup :size="size" :prepend="prepend" class="flex-nowrap">
      <input type="text" class="custom-input" :placeholder="`${props.placeholder}`" :label="props.label" />

      <DatePicker
        v-model="model"
        :auto-submit="props.autoSubmit"
        :custom-input="props.customInput"
        :input-class="props.inputClass"
        :input-format="props.inputFormat"
        :display-format="ShowDateAndTime"
        :view="props.view"
        :type="props.type"
        :format="props.format"
        :disabled="props.disabled"
        :clearable="props.clearable"
      />
    </RInputGroup>
  </div>
</template>
<script setup lang="ts">
import DatePicker from 'vue3-persian-datetime-picker'
import { RInputGroup } from '@routaa/ui-kit'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type Props = {
  modelValue: string
  placeholder?: string
  prepend?: string
  size?: string
  append?: string
  displayFormat?: 'dddd jDD jMMMM jYYYY HH:mm:ss' | 'dddd jDD jMMMM jYYYY '
  inputFormat?: 'jYYYY/jMM/jDD HH:mm' | 'YYYY/MM/DD HH:mm' | 'YYYY/MM/DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss' | 'HH:mm'
  format?: 'jYYYY/jMM/jDD HH:mm' | 'YYYY/MM/DD HH:mm' | 'YYYY/MM/DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss' | 'HH:mm'
  view?: 'day' | 'month' | 'year' | 'time'
  type?: 'date' | 'datetime' | 'year' | 'month' | 'time'
  min?: 'string'
  max?: 'string'
  editable?: boolean
  customInput?: string
  inputClass?: string
  autoSubmit?: boolean
  disabled?: boolean
  // disable
  label?: 'string'
  clearable?: false
}

const props = withDefaults(defineProps<Props>(), {
  format: 'YYYY-MM-DD HH:mm:ss',
  view: 'day',
  type: 'date',
  editable: false,
  inputClass: 'form-control',
  autoSubmit: false,
  disabled: false,
  clearable: false
})

interface Emits {
  (e: 'update:modelValue', val: any): void
}

const emit = defineEmits<Emits>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    emit('update:modelValue', val.replace(' ', 'T'))
  }
})

const ShowDateAndTime = computed(() => {
  return props.displayFormat ? props.displayFormat : `dddd jDD jMMMM jYYYY ${t('shared.clock')} HH:mm` 
})

</script>

<style scoped>
.custom-input {
  border: 1px solid #dadada;
  background: #fff;
  line-height: 30px;
  padding: 0 15px;
  vertical-align: middle;
}
</style>
