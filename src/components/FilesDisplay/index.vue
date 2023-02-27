<script lang="ts" setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import Item from './Item.vue'

type Props = {
  modelValue: string[]
  disabled?: boolean
  lightbox?: boolean
  multiple?: boolean
  prefixUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  disabled: false,
  lightbox: true,
  multiple: false
})

interface Emit {
  (e: 'update:modelValue', val: any): void
}

const emit = defineEmits<Emit>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const isDraggable = computed<boolean>(() => {
  return model.value.length > 1 && !props.disabled
})

const getSortableOptions = () => {
  return {
    animation: 200
  }
}

const removeItem = (i: string) => {
  model.value = model.value.filter((item) => item !== i)
}
</script>

<template>
  <div class="file-display">
    <draggable
      v-model="model"
      class="items"
      item-key="fileDisplay"
      group="images"
      :disabled="!isDraggable"
      v-bind="getSortableOptions()"
    >
      <template #item="{ element }">
        <item
          :model="element"
          :prefixUrl="props.prefixUrl"
          :disabled="props.disabled"
          :class="{ 'mb-3': props.multiple }"
          @remove="removeItem"
        />
      </template>
    </draggable>
  </div>
</template>
