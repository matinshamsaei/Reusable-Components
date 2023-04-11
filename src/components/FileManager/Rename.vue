<script setup lang="ts">
import $t from '@/composable/useTranslations'
import { RModal, RInputGroup, RFormInput } from '@routaa/ui-kit'
import { ref, computed } from 'vue'

type Props = {
  oldName?: string
}
const props = defineProps<Props>()

const show = ref(true)
const name = ref(props.oldName || '')


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
  show.value = true
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
    :ok-title="$t('shared.confirm')"
    @ok="emitConfirm"
    @hide="emitCancel"
  >
    <RInputGroup :prepend="$t('fileManager.newName')">
      <RFormInput v-model="name" dir="auto" />
    </RInputGroup>
  </RModal>
</template>
