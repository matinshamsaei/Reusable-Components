<script setup lang="ts">
import { RButton } from '@routaa/ui-kit'
import { isObject } from '@/utils/object'
import $t from '@/composables/useTranslations'

type Props = {
  selected: boolean | object | string | null
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

interface Emit {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emit>()

function emitConfirm() {
  emit('confirm')
}

function emitCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="p-2 bg-light border-top text-end">
    <RButton size="sm" variant="secondary" @click="emitCancel">
      {{ $t('shared.cancel') }}
    </RButton>

    <RButton v-if="isObject(props.selected)" size="sm" class="ms-2" variant="success" @click="emitConfirm">
      <font-awesome-icon icon="check" size="lg" />

      <span class="ml-2"></span>

      {{ $t('shared.select') }}
    </RButton>
  </div>
</template>
