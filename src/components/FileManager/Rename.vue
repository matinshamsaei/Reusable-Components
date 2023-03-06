<template>
  <RModal
    size="sm"
    centered
    no-fade
    no-close-on-backdrop
    :title="useTranslations('fileManager.createFolder')"
    :cancel-title="useTranslations('shared.cancel')"
    :ok-title="useTranslations('shared.confirm')"
    visible
    lazy
    @hide="emitCancel"
    @ok="emitConfirm"
    :ok-disabled="okDisabled"
    ok-variant="success"
  >
    <RInputGroup :prepend="useTranslations('fileManager.newName')">
      <RFormInput v-model="name" dir="auto" />
    </RInputGroup>
  </RModal>
</template>

<script setup lang="ts">
import useTranslations from '@/composable/useTranslations'
import { RModal, RInputGroup, RFormInput } from '@routaa/ui-kit'
import { ref, computed } from 'vue'

type Props = {
  oldName: string | undefined
}

const props = defineProps<Props>()

const name = ref(props.oldName || '')

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
