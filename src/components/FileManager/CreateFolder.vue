<script setup lang="ts">
import { ref, computed } from 'vue'
import { RModal, RInputGroup, RFormInput } from '@routaa/ui-kit'
import useTranslations from '@/composable/useTranslations'

const name = ref('')
const show = ref(true)

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
    v-model="show"
    size="sm"
    centered
    no-fade
    no-close-on-backdrop
    ok-variant="success"
    :ok-disabled="okDisabled"
    :title="useTranslations('fileManager.createFolder')"
    :cancel-title="useTranslations('shared.cancel')"
    :ok-title="useTranslations('shared.create')"
    @hide="emitCancel"
    @ok="emitConfirm"
  >
    <RInputGroup :prepend="useTranslations('fileManager.folderName')">
      <RFormInput v-model="name" dir="auto" />
    </RInputGroup>
  </RModal>
</template>
