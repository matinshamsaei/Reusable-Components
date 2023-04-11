<script lang="ts" setup>
import { ref, watch, nextTick, type HTMLAttributes } from 'vue'
import { RFormInput } from '@routaa/ui-kit'
import { convertNumbers2English } from '../../lib/utils'

type Numberish = number | string | null | undefined

type Props = {
  modelValue: string | number
  placeholder?: string
  decimal?: boolean
  decimalPlaces?: number
  noSeparator?: boolean
  negative?: boolean
  size?: 'sm' | 'md' | 'lg'
  state?: Function | boolean | null
  disabled?: boolean
  inputClass?: HTMLAttributes['class']
  id?: string
  debounce?: number | string
}

interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'blur', value: any): void
  (e: 'keyup', value: any): void
  (e: 'change', value: any): void
  (e: 'input', value: any): void
}

const emit = defineEmits<Emit>()

const props = withDefaults(defineProps<Props>(), {
  decimal: true,
  decimalPlaces: 8,
  noSeparator: false,
  size: 'md',
  state: null,
  debounce: 0
})

const model = ref<string>(getDisplayNumber(props.modelValue))

watch(
  () => model.value,
  (val: string | null, oldVal: string | null) => {
    if (symbolEntered(val, oldVal)) return
    let str = getDisplayNumber(val)
    if (val !== str) nextTick(() => (model.value = getDisplayNumber(val)))

    let num: number = 0
    if (str) num = +str.replace(/,/g, '')
    emit('input', num ? num : null)
    emit('update:modelValue', num ? num : null)
  }
)

watch(
  () => props.modelValue,
  (val: Numberish) => {
    if (model.value !== getDisplayNumber(val)) setModel(val)
  }
)

watch(
  () => props.decimalPlaces,
  () => (model.value = getDisplayNumber(model.value))
)

function regex() {
  const full = new RegExp(`[-]?[0-9]+([.][0-9]{0,${props.decimalPlaces}})?`)
  const negatively = /[-]?[0-9]+/
  const floatable = new RegExp(`[0-9]+([.][0-9]{0,${props.decimalPlaces}})?`)
  const simple = /[0-9]+/
  const decimal = props.decimal && props.decimalPlaces > 0
  if (props.negative && decimal) return full
  if (props.negative) return negatively
  if (decimal) return floatable
  return simple
}

function getDisplayNumber(number: Numberish): string {
  if (number === null) return ''
  number = String(number)
  number = number && number.replace(/,/g, '')
  if (!number) return ''
  number = convertNumbers2English(number)
  const matched = typeof number === 'string' && number.match(regex())
  if (!matched) return ''
  number = matched[0]
  number = convertLocalString(number)
  return number
}

function symbolEntered(val: string | null, oldVal: string | null) {
  val = val && val.replace(/,/g, '')
  oldVal = oldVal && oldVal.replace(/,/g, '')
  const decimal = props.decimal && props.decimalPlaces > 0
  const firstStateRegex = /^\-?\d+$/ // check current model has point or not
  const secondStateRegex = /^\-?\d+\.$/ // check the next input is point or not
  const decimalEntered = oldVal && val && decimal && firstStateRegex.test(oldVal) && secondStateRegex.test(val)
  const negativeRegex = /^\-$/
  const negativeEntered = val && props.negative && negativeRegex.test(val)
  return decimalEntered || negativeEntered
}

function convertLocalString(val: number | string) {
  if (!val || val === null) return ''
  val = +val
  if (props.noSeparator) return val.toString()
  return val.toLocaleString('en-GB', { maximumFractionDigits: props.decimalPlaces })
}

function setModel(num: Numberish) {
  model.value = getDisplayNumber(num)
}

function emitEvent(name: any, val: any) {
  emit(name, val)
}
</script>

<template>
  <RFormInput
    dir="ltr"
    :class="props.inputClass"
    :disabled="props.disabled"
    v-model="model"
    :state="props.state"
    :size="props.size"
    :id="props.id"
    :placeholder="props.placeholder"
    :debounce="props.debounce"
    @blur="emitEvent('blur', $event)"
    @keyup="emitEvent('keyup', $event)"
    @change="emitEvent('change', $event)"
    autocomplete="off"
  />
</template>
