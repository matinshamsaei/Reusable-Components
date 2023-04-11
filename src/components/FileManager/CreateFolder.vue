<script setup lang="ts">
import { ref, computed } from 'vue'
import { RModal, RInputGroup, RFormInput } from '@routaa/ui-kit'
import $t from '@/composable/$t'

const name = ref('')
const show = ref(true)

interface Emit {
  (e: 'confirm', value: any): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emit>()

const isOkDisabled = computed(() => {
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
    :ok-disabled="isOkDisabled"
    :title="$t('fileManager.createFolder')"
    :cancel-title="$t('shared.cancel')"
    :ok-title="$t('shared.create')"
    @hide="emitCancel"
    @ok="emitConfirm"
  >
    <RInputGroup :prepend="$t('fileManager.folderName')">
      <RFormInput v-model="name" dir="auto" />
    </RInputGroup>
  </RModal>
</template>
