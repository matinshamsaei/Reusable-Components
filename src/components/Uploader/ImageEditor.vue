<script lang="ts" setup>
import { reactive, ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import { getDataUrlFromFile, getMimeTypeExtension, type FileType } from '@/utils/image'
import { RModal, RButton } from '@routaa/ui-kit'

type Props = {
  aspectRatio?: number
}

type Flip = {
  x: number
  y: number
}

type ActionButtons = {
  icon: string
  event: Function
}

interface Emit {
  (e: 'change', value: any): FileList
}

const emit = defineEmits<Emit>()

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 16 / 9
})

const cropper = ref()
const open = ref<boolean>(false)
const fileName = ref<string | null>(null)
const src = ref<string | ArrayBuffer | null | undefined>(null)
const flip: Flip = reactive({
  x: 1,
  y: 1
})

const actionButtons: ActionButtons[] = reactive([
  { icon: 'left-right', event: flipX },
  { icon: 'up-down', event: flipY },
  { icon: 'rotate-right', event: rotateRight },
  { icon: 'rotate-left', event: rotateLeft },
  { icon: 'magnifying-glass-minus', event: zoomOut },
  { icon: 'magnifying-glass-plus', event: zoomIn }
])

function show(file: File): void {
  fileName.value = null
  src.value = null
  getDataUrlFromFile(file).then((dataUrl) => {
    fileName.value = file.name
    open.value = true
    src.value = dataUrl
  })
}

function hide() {
  open.value = false
}

function submit(): void {
  cropper.value.getCroppedCanvas().toBlob((file: FileType) => {
    file.name = changeExtensionBasedOnMimeType(fileName.value, file.type)
    emit('change', [file])
    hide()
  })
}

function changeExtensionBasedOnMimeType(fileName: string | null, mimeType: string) {
  const name = (fileName && fileName.split('.').splice(0, -1).join('.')) || ''
  const ext = getMimeTypeExtension(mimeType)
  return `${name}.${ext}`
}

function rotateRight(): void {
  cropper.value.rotate(90)
}

function rotateLeft(): void {
  cropper.value.rotate(-90)
}

function zoomOut(): void {
  cropper.value.relativeZoom(-0.5)
}

function zoomIn(): void {
  cropper.value.relativeZoom(0.5)
}

function flipX(): void {
  flip.x = -flip.x
  cropper.value.scaleX(flip.x)
}

function flipY(): void {
  flip.y = -flip.y
  cropper.value.scaleY(flip.y)
}

defineExpose({ show })
</script>

<template>
  <RModal
    v-model="open"
    centered
    hide-header
    no-close-on-backdrop
    size="lg"
    footer-class="p-2 d-block"
    body-class="p-2 image-editor"
  >
    <VueCropper v-if="src" ref="cropper" :src="src" :aspect-ratio="props.aspectRatio" :auto-crop-area="0.9" />

    <template #modal-footer>
      <div class="row align-items-center">
        <div class="col my-2 my-md-0">
          <RButton
            v-for="(button, index) in actionButtons"
            :key="index"
            size="sm"
            variant="link"
            class="me-2 text-primary"
            @click="button.event"
          >
            <font-awesome-icon :icon="button.icon" size="lg" />
          </RButton>
        </div>

        <div class="col-md-auto">
          <div class="row g-0 align-items-center">
            <div class="col-md-auto mb-2 mb-md-0">
              <RButton variant="success" class="me-3 px-3" @click="submit">
                {{ $t('shared.save') }}
              </RButton>
            </div>

            <div class="col-md-auto">
              <RButton @click="hide">
                {{ $t('shared.cancel') }}
              </RButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </RModal>
</template>
