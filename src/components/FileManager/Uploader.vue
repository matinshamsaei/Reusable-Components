<template>
  <RModal
    centered
    no-fade
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
    :title="useTranslations('fileManager.upload')"
    visible
    lazy
    @hide="emitClose"
    body-class="p-4"
  >
    <RUploader :upload="uploadApi" @change="emitClose" :accept="accept" />
  </RModal>
</template>

<script setup lang="ts">
import useTranslations from '@/composable/useTranslations';
import { RModal, RUploader } from '@routaa/ui-kit'
import { computed, reactive } from 'vue'

type ApiTypes = {
  upload: Function
}

type Props = {
  api: ApiTypes
  docType: 'IMAGE' | 'FILE' | 'MEDIA'
  path: string
}

const props = withDefaults(defineProps<Props>(), {})

const uploadModel = reactive({ api: props.api, type: props.docType, path: props.path })

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
  return props.api.upload(props.docType, props.path, files, onProgress).then((res: any) => {
    return res[0].url
  })
}

function emitClose(uploadedDocs: Object) {
  emit('close', uploadedDocs)
}
</script>
