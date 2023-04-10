<script setup lang="ts">
import { RButton } from '@routaa/ui-kit'
import { isObject } from '../../utils/object'
import useTranslations from '@/composable/useTranslations'

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
  <div class="p-2 bg-light border-top">
    <!-- :class="{ 'text-right': $dir.ltr, 'text-left': $dir.rtl }" for above div -->
    <RButton size="sm" variant="secondary" class="mx-2" @click="emitCancel">
      {{ useTranslations('shared.cancel') }}
    </RButton>

    <RButton v-if="isObject(props.selected)" size="sm" variant="success" @click="emitConfirm">
      <!-- :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }" -->
      <font-awesome-icon icon="check" size="lg" />

      <span class="ml-2"></span>

      {{ useTranslations('shared.select') }}
    </RButton>
  </div>
</template>
