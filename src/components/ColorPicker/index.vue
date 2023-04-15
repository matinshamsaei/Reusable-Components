<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { RInputGroup, RInputGroupAppend, RInputGroupText, RDropdown, RFormInput } from '@routaa/ui-kit'
import { ColorPicker } from 'vue3-colorpicker'

type Props = {
  modelValue: string
  label?: string
  prepend?: string
  size?: string
  placeholder?: string
  required?: boolean
  debounce?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  debounce: 300
})

const color = ref(props.modelValue || '#eee')

const dropdown = ref()

const attrs = useAttrs()

interface Emits {
  (e: 'update:modelValue', val: any): void
}

const emit = defineEmits<Emits>()

const model = computed<string>({
  get() {
    return props.modelValue
  },
  set(val: string) {
    if (val.startsWith('#')) emit('update:modelValue', val)
    else if (val.length > 1) emit('update:modelValue', `#${val}`)
    else emit('update:modelValue', null)
  }
})

function updateValue(e: string) {
  emit('update:modelValue', e)
}
</script>

<template>
  <div class="position-relative">
    <label v-if="props.label"> {{ props.label }} : </label>

    <RInputGroup
      v-bind="attrs"
      :size="props.size"
      class="position-relative"
      :prepend="props.prepend"
      :class="props.required ? 'required' : ''"
    >
      <RFormInput v-model="model" dir="ltr" :placeholder="props.placeholder" :debounce="props.debounce" />

      <RInputGroupAppend>
        <RInputGroupText class="px-1 py-0">
          <RDropdown
            ref="dropdown"
            no-caret
            toggle-class="p-0"
            variant="transparent"
            menu-class="p-0"
            aria-expanded="false"
            data-bs-auto-close="outside"
          >
            <template #button-content aria-expanded="false" data-bs-auto-close="outside">
              <font-awesome-icon
                icon="square"
                class="align-middle"
                :size="props.size === 'sm' ? 'lg' : '2x'"
                :style="{ color: model }"
              />
            </template>

            <color-picker
              v-model="color"
              @update:pureColor="updateValue"
              format="hex"
              picker-type="chrome"
              :is-widget="true"
            />
          </RDropdown>
        </RInputGroupText>
      </RInputGroupAppend>
    </RInputGroup>
  </div>
</template>
