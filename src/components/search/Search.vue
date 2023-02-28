<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue'
import type { IObject } from '../../utils/object'
import { attrsPartitioner } from '@/lib/utils'
import AdvanceSearch from '@/components/search/AdvanceSearch.vue'

type Props = {
  modelValue: Array<IObject>
  size?: string
  prepend?: string
  title?: string
  fields?: Array<IObject>
  valueField?: string | Function | boolean
  textField?: string | Function
  select?: Function
  search?: Function
  simple?: boolean
  disabled?: boolean
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  valueField: () => 'id',
  textField: () => 'name',
  simple: false,
  disabled: false,
  multiple: false
})

type Emits = {
  (e: 'input', value: IObject[]): void
}

const emits = defineEmits<Emits>()

const selectedItems = computed<IObject[]>({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('input', val)
  }
})

const attrs = useAttrs()
const $listeners = attrsPartitioner(attrs)

const listeners = computed(() => {
  return {
    ...$listeners,
    input: emitInput
  }
})

onMounted(() => {
  initialize()
})

function initialize() {
  if (props.select) {
    props.select().then((res: any) => {
      if (!res) return
      if (!props.multiple) {
        res = [res]
      }
      selectedItems.value = res
    })
  }
}

function emitInput(value: any) {
  if (Array.isArray(value)) emits('input', value)
  else if (value) emits('input', [value])
}

const advance = ref()

function clear() {
  advance.value?.clear()
}

function show() {
  advance.value?.show()
}

function hide() {
  advance.value?.hide()
}

function reset() {
  advance.value?.reset()
}

function searching() {
  advance.value?.searching()
}
</script>

<template>
  <div>
    <template v-if="simple">
      <auto-complete-multi
        v-if="multiple"
        v-model="selectedItems"
        :prepend="prepend"
        :search="search"
        :select="select"
        :disabled="disabled"
        :valueField="valueField"
        :textField="textField"
        v-on="listeners"
        :model-field="false"
      />

      <auto-complete
        v-else
        v-model="selectedItems[0]"
        :prepend="prepend"
        :search="search"
        :disabled="disabled"
        :valueField="valueField"
        :textField="textField"
        :model-field="false"
        v-on="listeners"
      />
    </template>

    <advance-search
      v-else
      v-model="selectedItems"
      :size="size"
      :prepend="prepend"
      :title="title"
      :fields="fields"
      :select="select"
      :search="search"
      :text-field="textField"
      :value-field="valueField"
      :disabled="disabled"
      :multiple="multiple"
      v-on="listeners"
      ref="advance"
    />
  </div>
</template>
