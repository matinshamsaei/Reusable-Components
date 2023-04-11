<script lang="ts" setup>
import { computed, ref, reactive, onMounted, watch, type HTMLAttributes } from 'vue'
import { RButton, RAlert } from '@routaa/ui-kit'
import $t from '../../composable/useTranslations'
import useErrors from '../../composable/useErrors'
import FileDisplay from '../../components/FilesDisplay/index.vue'
import ImageEditor from './ImageEditor.vue'
import { scaleImage } from '../../utils/image'
import { isEmpty } from '../../utils/object'

type Props = {
  modelValue: string | object
  uploadReq: Function
  accept?: string
  aspectRatio?: number
  autoScale?: number
  disabled?: boolean
  doc?: boolean
  editor?: boolean
  excel?: boolean
  image?: boolean
  audio?: boolean
  audioExtensions?: string[]
  labelClass?: HTMLAttributes['class']
  lightbox?: boolean
  max?: number | boolean
  multiple?: boolean
  prefixUrl?: string
  upload?: Function
  uploadMaxSize?: number
  isSprite?: boolean
  isStatic?: boolean
  zip?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  btnTitle?: string
}

type Extension = {
  image: string[]
  zip: string[]
  doc: string[]
  excel: string[]
  audio: string[]
}

type Progress = {
  total: number
  loaded: number
}

interface Emit {
  (e: 'progress', value: any): void
  (e: 'update:modelValue', value: string | object | null): void
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 0,
  disabled: false,
  doc: false,
  editor: false,
  excel: false,
  audio: false,
  image: false,
  lightbox: true,
  max: false,
  multiple: false,
  uploadMaxSize: 1073741824, // 1073741824 bytes = (1 Gig)
  isSprite: false,
  isStatic: false,
  zip: false,
  size: 'sm',
  audioExtensions: () => ['mp3', 'ogg']
})

const emit = defineEmits<Emit>()

const imageEditor = ref<InstanceType<typeof ImageEditor> | null>(null)
const input = ref<HTMLInputElement | null>(null)
const progress = ref<Number>(0)
const filePaths = ref<string[]>([])
const uploadErrors = ref<string[]>([])
const extension: Extension = reactive({
  image: ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'webp', 'svg'],
  zip: ['zip', 'rar'],
  doc: ['doc', 'docx', 'txt', 'pdf'],
  excel: ['xls', 'xlsx'],
  audio: props.audioExtensions
})

watch(
  () => props.modelValue,
  (val) => {
    if (val && typeof val === 'string') {
      if (props.isStatic) filePaths.value = val.split(',')
    } else {
      uploadErrors.value = []
      filePaths.value = []
    }
  }
)

watch(
  () => props.accept,
  (value, oldValue) => {
    if (value !== oldValue) validateAllFiles()
  }
)

onMounted(() => {
  if (props.modelValue && typeof props.modelValue === 'string') filePaths.value = props.modelValue.split(',')

  validateAllFiles()
})

const label = computed<string>(() => {
  return props.label ? props.label : $t('shared.image')
})

const btnTitle = computed<string>(() => {
  return props.btnTitle ? props.btnTitle : $t('forms.chooseFile')
})

const uploading = computed<boolean>(() => {
  return typeof progress.value === 'number' && progress.value > 0
})

const extensions = computed<string>(() => {
  if (props.accept) return props.accept

  const extensionValue = (Object.keys(extension) as any[]).reduce((total: string[], key: keyof Extension) => {
    // if props in enable
    if (props[key]) total.push(...extension[key])

    return total
  }, [])

  if (isEmpty(extensionValue)) extensionValue.push(...extension.image)

  return (extensionValue as any[]).map((ext) => `.${ext}`).join(',')
})

function onChangeInputFile(e: Event) {
  uploadErrors.value = []
  const target = e.target as HTMLInputElement
  let files: FileList | undefined
  if (target && target.files) files = target?.files

  if (!files?.length) return

  if (props.max && typeof props.max === 'number' && files?.length > props.max) {
    uploadErrors.value.push($t('forms.filesNumberExceedsTheLimit', 0, { max: props.max }))
    return
  }

  // Validate Size And Extension Of Files
  Array.from(files).forEach((file) => {
    validateFileExtension(file)
    validateFileSize(file)
  })

  if (uploadErrors.value && uploadErrors.value.length) return

  let promise: Promise<FileList> = Promise.resolve(files)
  if (props.autoScale) promise = autoScaleFiles(files)

  promise
    .then((items) => {
      if (props.isStatic) emit('update:modelValue', items[0])
      else if (props.editor && isImage(items[0].name)) openEditor(items[0])
      else uploadFiles(items)
    })
    .catch((err) => {
      if (typeof err === 'object') useErrors(err)
    })
}

function uploadFiles(files: FileList) {
  progress.value = 0.1
  return uploadReq(files)
    .then((res: string[]) => {
      if (!isEmpty(res)) filePaths.value.push(...res)
      emitInput()
    })
    .catch((err: any) => {
      if (typeof err === 'object') uploadErrors.value.push((typeof useErrors(err) === 'string' && useErrors(err)) || '')
    })
    .finally(() => {
      progress.value = 0
      cleanInput()
    })
}

function uploadReq(files: FileList) {
  if (props.upload && typeof props.upload === 'function') return props.upload(files, onProgress)
  else if (typeof props.uploadReq === 'function') return props.uploadReq(files, props.prefixUrl, onProgress)
}

function emitInput(): void {
  let value = null
  if (props.isSprite) value = isEmpty(filePaths.value) ? '' : filePaths.value[0]
  else value = isEmpty(filePaths.value) ? '' : filePaths.value.toString()

  emit('update:modelValue', value)
}

function onProgress(e: Progress): void {
  progress.value = (e.loaded * 100) / e.total

  emit('progress', progress.value)
}

function isImage(fileName: string): boolean {
  return extension.image.includes(getExtension(fileName))
}

function validateFileSize(file: File): void {
  if (file.size > props.uploadMaxSize) {
    const maxSizeInMB = Math.floor(props.uploadMaxSize / 1024)
    const errorMessage = $t('forms.file_max_size_exceeded', 0, {
      fileName: file.name,
      maxSize: maxSizeInMB
    })

    uploadErrors.value.push(errorMessage)
  }
}

function validateAllFiles(): void {
  if (isEmpty(props.modelValue)) {
    uploadErrors.value = []
    return
  }

  typeof props.modelValue === 'string' &&
    (props.modelValue.split(',') as any[]).forEach((file) => {
      validateFileExtension(file)
    })
}

function validateFileExtension(file: File): void {
  if (extensions.value.includes('*')) return

  const extensionName = getExtension(file.name)
  const invalidExtension = !extensions.value.toLocaleLowerCase().includes(extensionName)
  if (invalidExtension) {
    const message = $t('forms.fileExtensionNotAccepted', 0, {
      fileName: extensionName,
      accepted: extensions.value
    })

    uploadErrors.value.push(message)
  }
}

function getExtension(fileName: string): string {
  return (fileName.split('.') as any[]).pop()?.toLocaleLowerCase()
}

const cleanInput = () => {
  if (input.value) input.value.value = ''
}

function autoScaleFiles(files: FileList): Promise<any> {
  const scales: any[] = []
  Array.from(files).forEach((file) => {
    if (file.type.match(/image.*/)) {
      scales.push(scaleImage(file, props.autoScale || 0))
    } else {
      scales.push(file)
    }
  })
  return Promise.all(scales)
}

function openEditor(file: File): void {
  imageEditor.value?.show(file)
}

function openBrowse(): void {
  input.value?.click()
}

function editorChanged(file: FileList): void {
  uploadFiles(file)
}
</script>

<template>
  <slot name="label">
    <p v-if="label" class="mb-3" :class="props.labelClass">
      {{ label }}
    </p>
  </slot>

  <RAlert variant="danger" class="mb-3" :show="!!uploadErrors.length">
    <ul class="m-0 px-1">
      <li v-for="error in uploadErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </RAlert>

  <FileDisplay
    v-if="filePaths.length"
    v-model="filePaths"
    :prefix-url="props.prefixUrl"
    :disabled="props.disabled"
    :multiple="props.multiple"
    :lightbox="props.lightbox"
    @input="emitInput"
  />

  <div v-if="props.multiple || !filePaths.length">
    <input
      type="file"
      ref="input"
      name="file"
      class="d-none"
      :accept="extensions"
      :disabled="uploading"
      @change="onChangeInputFile"
    />

    <RButton
      class="text-nowrap"
      :size="props.size"
      :variant="uploading ? 'success' : 'secondary'"
      :disabled="props.disabled"
      @click="openBrowse"
    >
      <font-awesome-icon :icon="uploading ? 'gear' : 'cloud-arrow-up'" :spin="uploading" class="align-middle me-1" />

      {{ uploading ? $t('forms.uploading') : btnTitle }}
    </RButton>

    <div
      v-if="progress"
      class="progress mt-2"
      aria-valuemin="0"
      role="progressbar"
      style="height: 5px"
      aria-valuemax="100"
      aria-label="Animated striped"
      :aria-valuenow="`${progress}`"
    >
      <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>

  <ImageEditor v-if="props.editor" ref="imageEditor" :aspect-ratio="props.aspectRatio" @change="editorChanged" />
</template>
