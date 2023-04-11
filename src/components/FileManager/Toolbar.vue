<script setup lang="ts">
import { RButton } from '@routaa/ui-kit'
import { FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import $t from '../../composable/useTranslations'

type Props = {
  progressing: boolean
  isMember?: boolean
}

const props = defineProps<Props>()

interface Emit {
  (e: 'refresh'): void
  (e: 'openCreateFolder'): void
  (e: 'openUploader'): void
}

const emit = defineEmits<Emit>()

function emitRefresh() {
  emit('refresh')
}

function emitCreateFolder() {
  emit('openCreateFolder')
}

function emitUpload() {
  emit('openUploader')
}
</script>

<template>
  <div class="p-2 bg-light border-bottom d-flex justify-content-between">
    <div>
      <RButton v-if="!isMember" size="sm" :disabled="props.progressing" variant="secondary" @click="emitCreateFolder">
        <font-awesome-layers class="align-middle" fixed-width>
          <font-awesome-icon icon="folder" size="lg" class="text-dark" />

          <font-awesome-icon icon="plus" transform="shrink-7 down-1 left-1" />
        </font-awesome-layers>

        <span class="me-2" />
        {{ $t('fileManager.createFolder') }}
      </RButton>

      <RButton size="sm" :disabled="props.progressing" variant="secondary" class="ms-2" @click="emitUpload">
        <font-awesome-layers class="align-middle" fixed-width>
          <font-awesome-icon icon="cloud" size="lg" class="text-dark" />

          <font-awesome-icon icon="arrow-up" transform="shrink-7 down-1 right-2" />
        </font-awesome-layers>

        <span class="me-2" />
        {{ $t('fileManager.upload') }}
      </RButton>
    </div>

    <div class="mr-auto">
      <RButton size="sm" :disabled="props.progressing" variant="link" @click="emitRefresh">
        <font-awesome-icon icon="rotate" :spin="props.progressing" size="lg" class="text-secondary" />
      </RButton>
    </div>
  </div>
</template>
