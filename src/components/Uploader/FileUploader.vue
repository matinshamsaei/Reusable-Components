<script lang="ts" setup>
import { computed } from 'vue'
import { RButton } from '@routaa/ui-kit'
import Uploader from './index.vue'

type Props = {
  modelValue: FileList | File | string
  name?: string
  editor?: boolean
  excel?: boolean
  label?: string
  uploadReq: Function
}

interface Emit {
  (e: 'update:modelValue', value: File | FileList | string): void
}

const props = withDefaults(defineProps<Props>(), {
  editor: false,
  excel: false,
  label: ''
})

const emit = defineEmits<Emit>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const getExtension = computed(() => {
  return model.value && model.value instanceof File && model.value.name.toUpperCase().split('.').pop()
})

const remove = () => {
  model.value = ''
}
</script>

<template>
  <div class="file-display">
    <Uploader
      v-if="!model"
      v-model="model"
      is-static
      :editor="props.editor"
      :excel="props.excel"
      :label="props.label"
      :name="props.name"
      :upload-req="uploadReq"
    />

    <div v-else class="items">
      <div class="item dimensions">
        <small v-if="getExtension" class="file">
          {{ getExtension }}
        </small>

        <RButton size="sm" class="remove-btn" variant="link" @click="remove">
          <font-awesome-icon icon="xmark" class="align-middle" />
        </RButton>
      </div>
    </div>
  </div>
</template>
