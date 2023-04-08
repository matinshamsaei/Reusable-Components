<script setup lang="ts">
import { computed, ref } from 'vue'
import { RModal } from '@routaa/ui-kit'
import Uploader from '../Uploader/index.vue'
import useTranslations from '@/composable/useTranslations'

const model = ref('')

type ApiTypes = {
  upload: Function
}

type Props = {
  api: ApiTypes
  docType: 'IMAGE' | 'FILE' | 'MEDIA'
  path: string
}

const props = withDefaults(defineProps<Props>(), {})

interface Emit {
  (e: 'close', value: any): void
}

const emit = defineEmits<Emit>()

const accept = computed(() => {
  switch (props.docType) {
    case 'IMAGE':
      return '.jpg,.jpeg,.gif,.png,.tif,.ico,.bmp,.zip'
    case 'MEDIA':
      return '.mp3,.wma,.wav,.mp4,.3gp,.ogg,.wmv,.webm,.flv,.mov.zip'
    case 'FILE':
      return '*'
    default:
      return '*'
  }
})

function uploadApi(files: object, onProgress: object) {
  return props.api.upload(props.docType, props.path, files, onProgress).then((res: any) => res[0].url)
}

function emitClose(uploadedDocs: string | object | null) {
  emit('close', uploadedDocs)
}
</script>

<template>
  <RModal
    no-fade
    centered
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    body-class="p-4"
    :title="useTranslations('fileManager.upload')"
    @hide="emitClose"
  >
    <Uploader v-model="model" :upload="uploadApi" @update:model-value="emitClose" :accept="accept" />
  </RModal>
</template>
