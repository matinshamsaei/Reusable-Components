<script setup lang="ts">
import { RButton } from '@routaa/ui-kit'
import useTranslations from '../../composable/useTranslations'
import { FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

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

<template>
  <div class="p-2 bg-light border-bottom d-flex">
    <RButton size="sm" variant="secondary" @click="emitCreateFolder">
      <!-- :disabled="props.progressing" -->
      <font-awesome-layers class="align-middle" fixed-width>
        <font-awesome-icon icon="folder" size="lg" class="text-dark" />
        <font-awesome-icon icon="plus" transform="shrink-7 down-1 left-1" />
      </font-awesome-layers>

      <span class="me-2"/>
      {{ useTranslations('fileManager.createFolder') }}
    </RButton>

    <RButton size="sm" variant="secondary" class="mx-2"  @click="emitUpload">
      <!-- :disabled="props.progressing" -->
      <font-awesome-layers class="align-middle" fixed-width>
        <font-awesome-icon icon="cloud" size="lg" class="text-dark" />
        <font-awesome-icon icon="arrow-up" transform="shrink-7 down-1 right-2" />
      </font-awesome-layers>

      <span class="me-2"/>
      {{ useTranslations('fileManager.upload') }}
    </RButton>

    <div class="mr-auto">
      <RButton size="sm" variant="link" :disabled="props.progressing" @click="emitRefresh">
        <font-awesome-icon icon="rotate" :spin="props.progressing" size="lg" class="text-secondary" />
      </RButton>
    </div> 
  </div>
</template>
