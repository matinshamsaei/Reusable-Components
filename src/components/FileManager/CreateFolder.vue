<script setup lang="ts">
import { RModal, RInputGroup, RFormInput } from '@routaa/ui-kit'
import { ref, computed } from 'vue'
import useTranslations from '@/composable/useTranslations'

const name = ref('')

interface Emit {
  (e: 'confirm', value: any): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emit>()

const okDisabled = computed(() => {
  const okDisabledName = name.value || ''
  return okDisabledName.trim().length ? false : true
})

function emitConfirm() {
  emit('confirm', name.value)
}

function emitCancel() {
  emit('cancel')
}
</script>

<template>
  <RModal
    size="sm"
    centered
    no-fade
    no-close-on-backdrop
    :title="useTranslations('fileManager.createFolder')"
    :cancel-title="useTranslations('shared.cancel')"
    :ok-title="useTranslations('shared.create')"
    visible
    lazy
    @hide="emitCancel"
    @ok="emitConfirm"
    :ok-disabled="okDisabled"
    ok-variant="success"
  >
    <RInputGroup :prepend="useTranslations('fileManager.folderName')">
      <RFormInput v-model="name" dir="auto" />
    </RInputGroup>
  </RModal>
</template>
