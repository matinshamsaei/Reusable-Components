<script setup lang="ts">
import { computed } from 'vue'
import DatePicker from 'vue3-persian-datetime-picker' // https://talkhabi.github.io/vue-persian-datetime-picker/guide
import { RInputGroup } from '@routaa/ui-kit'
import $t from '@/composables/useTranslations';


type Props = {
  modelValue: string | string[]
  placeholder?: string
  prepend?: string
  size?: string
  append?: string
  displayFormat?: string //'dddd jDD jMMMM jYYYY HH:mm:ss' | 'dddd jDD jMMMM jYYYY '
  inputFormat?: string //'jYYYY/jMM/jDD HH:mm'| 'YYYY/MM/DD HH:mm'| 'YYYY/MM/DD HH:mm:ss'| 'YYYY-MM-DD HH:mm:ss'| 'HH:mm'
  format?: string //'jYYYY/jMM/jDD HH:mm' | 'YYYY/MM/DD HH:mm' | 'YYYY/MM/DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss' | 'HH:mm'
  view?: string // Show a specific section at startup => 'day' | 'month' | 'year' | 'time'
  type?: string // 'date' | 'datetime' | 'year' | 'month' | 'time'
  min?: string // Limit datetime picker minimum and maximum
  max?: string // Limit datetime picker minimum and maximum
  editable?: boolean
  customInput?: string | boolean // For change design input
  inputClass?: string
  autoSubmit?: boolean
  disabled?: boolean // for Disable datepicker
  disable?: [string] | string | Function // for Disable dates for example certain days in week or specific date 1402/03/14
  label?: string
  clearable?: boolean
  multiple?: boolean
  simple?: boolean // Show simple card For select date
  compactTime?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  format: 'YYYY-MM-DD HH:mm:ss',
  view: 'day',
  type: 'date',
  editable: false,
  inputClass: 'form-control',
  autoSubmit: false,
  disabled: false,
  clearable: false,
  multiple: false,
  simple: false,
  customInput: false,
  compactTime: false
})

interface Emits {
  (e: 'update:modelValue', val: any): void
}

const emit = defineEmits<Emits>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val: string | string[]) {
    if (val?.length && typeof val === 'string') emit('update:modelValue', val.replace(' ', 'T'))
    else emit('update:modelValue', val)
  }
})

const showDateAndTime = computed(() => {
  return props.displayFormat ? props.displayFormat : `dddd jDD jMMMM jYYYY ${$t('shared.clock')} HH:mm`
})

const customInput = computed(() => {
  return props.customInput ? `.custom-input` : ``
})
</script>

<template>
  <div>
    <RInputGroup
      :size="size"
      :prepend="prepend"
      class="date-time-picker flex-nowrap"
      :class="{ 'none-prepend': !props.prepend }"
    >
      <DatePicker
        v-model="model"
        :auto-submit="props.autoSubmit"
        :editable="props.editable"
        :input-class="props.inputClass"
        :custom-input="customInput"
        :input-format="props.inputFormat"
        :display-format="showDateAndTime"
        :view="props.view"
        :type="props.type"
        :format="props.format"
        :disabled="props.disabled"
        :disable="props.disable"
        :clearable="props.clearable"
        :multiple="props.multiple"
        :simple="props.simple"
        :placeholder="`${props.placeholder}`"
        :label="props.label"
        :compact-time="props.compactTime"
      />

      <input
        v-if="customInput"
        type="text"
        :placeholder="`${props.placeholder}`"
        :label="props.label"
        class="custom-input form-control"
        :class="{ 'custom-input': customInput }"
      />
    </RInputGroup>
  </div>
</template>

