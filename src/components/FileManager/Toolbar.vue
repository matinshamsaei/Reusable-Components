<template>
  <div class="p-2 bg-light border-bottom d-flex">
    <RButton size="sm" variant="secondary" :disabled="props.progressing" @click="emitCreateFolder">
      <font-awesome-layers class="align-middle" fixed-width>
        <font-awesome-icon icon="folder" size="lg" class="text-white"></font-awesome-icon>
        <font-awesome-icon icon="plus" transform="shrink-7 down-1 left-1"></font-awesome-icon>
      </font-awesome-layers>

      <span class="ml-2"></span>
      {{ useTranslations('fileManager.createFolder') }}
    </RButton>

    <RButton size="sm" variant="secondary" class="mx-2" :disabled="props.progressing" @click="emitUpload">
      <font-awesome-layers class="align-middle" fixed-width>
        <font-awesome-icon icon="cloud" size="lg" class="text-white"></font-awesome-icon>
        <font-awesome-icon icon="arrow-up" transform="shrink-3 down-1 left-4"></font-awesome-icon>
      </font-awesome-layers>

      <span class="ml-2"></span>
      {{ useTranslations('fileManager.upload') }}
    </RButton>

    <div class="mr-auto">
      <RButton size="sm" variant="link" :disabled="props.progressing" @click="emitRefresh">
        <font-awesome-icon icon="rotate" :spin="props.progressing" size="lg" class="text-secondary"></font-awesome-icon>
      </RButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RButton } from '@routaa/ui-kit';
import useTranslations from '../../composable/useTranslations'

type Props = {
  progressing: boolean
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
