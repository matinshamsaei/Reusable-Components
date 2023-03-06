<script setup lang="ts">
import { RModal } from '@routaa/ui-kit'
import Uploader from '../Uploader/index.vue'
import useTranslations from '@/composable/useTranslations'
import { computed, ref, reactive } from 'vue'

///////////test

// v-model="model" :upload-req="uploadReq"

const model = ref('')

async function uploadReq(files: FileList, serverType = 'userManagement', onUploadProgress: number) {
  const formData = new FormData()

  Array.from(files).forEach((file) => {
    formData.append('files', file, file.name)
  })

  const item = await fetch('http://192.168.7.16:8082/api/pub/files/temp', {
    method: 'POST',
    body: formData
  })

  return item.json()
}

//////////test

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
    <Uploader v-model="model" :upload-req="uploadReq" :upload="uploadApi" @change="emitClose" :accept="accept" />
  </RModal>
</template>
