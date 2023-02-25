<script lang="ts" setup>
import { RButton } from '@routaa/ui-kit'
import BackBtn from '../BackBtn/index.vue'

type Props = {
  progressing?: boolean
  noSubmit?: boolean
  noBack?: boolean
  edit?: boolean
  noCard?: boolean
  hasCancel?: boolean
  backUrl?: string
  icon?: string
  smallGutter?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  noSubmit: false,
  noBack: false,
  edit: false,
  noCard: false,
  hasCancel: false,
  smallGutter: false,
  size: 'md'
})

interface Emit {
  (e: 'submit'): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emit>()

const emitSubmit = () => {
  emit('submit')
}

const emitCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div
    class="d-flex flex-row justify-content-center justify-content-sm-end mx-auto mx-sm-0"
    :class="props.noCard ? '' : 'card p-3'"
  >
    <div class="row">
      <div class="col-auto mb-sm-0">
        <RButton
          v-if="!props.noSubmit"
          variant="success"
          :disabled="props.progressing"
          :size="props.size"
          @click.prevent="emitSubmit"
        >
          <span v-if="edit" id="edit-action" class="text-nowrap" :class="props.smallGutter ? 'px-3' : 'px-4'">
            <font-awesome-icon v-if="props.icon" id="edit-action-icon" :icon="props.icon" class="align-middle ms-1" />

            {{ $t('shared.save') }}
          </span>

          <span v-else class="text-nowrap" :class="props.smallGutter ? 'px-3' : 'px-4'">
            <font-awesome-icon v-if="props.icon" :icon="props.icon" id="add-action-icon" class="align-middle ms-1" />

            {{ $t('shared.add') }}
          </span>
        </RButton>
      </div>

      <div v-if="!props.noBack && !props.hasCancel" class="col-auto">
        <BackBtn :to="props.backUrl" :size="props.size" :small-gutter="props.smallGutter" />
      </div>

      <div v-if="hasCancel" class="col-auto">
        <RButton
          id="cancel-btn"
          variant="secondary"
          :size="props.size"
          :class="props.smallGutter ? 'px-3' : 'px-4'"
          @click.prevent="emitCancel"
        >
          <span class="px-2 text-nowrap">
            {{ $t('shared.cancel') }}
          </span>
        </RButton>
      </div>
    </div>
  </div>
</template>
