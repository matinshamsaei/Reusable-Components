<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { ref, watch, nextTick, type Component } from 'vue'
import { RModal, RButton } from '@routaa/ui-kit'

type Props = {
  modelValue?: boolean
  icon?: [] | string
  iconClass?: object | string
  disabled?: boolean
  notActivator?: boolean
  tag?: Component | string | object
  progressing?: boolean
  tagAttrs?: object
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  notActivator: false,
  tag: RButton,
  progressing: false,
  tagAttrs: () => ({})
})

interface ModalEmits {
  (e: 'input', value: boolean): void
  (e: 'show'): void
  (e: 'shown'): void
  (e: 'submit', value: object): void
  (e: 'hide'): void
  (e: 'hidden'): void
}
const emits = defineEmits<ModalEmits>()

const open = ref<boolean>(false)

watch(
  () => props.modelValue,
  (val) => (open.value = val)
)

watch(open, (val) => {
  emits('input', val)
  if (val) emits('show')
})

function show() {
  if (props.disabled) return

  emits('show')
  open.value = true
  nextTick(() => {
    emits('shown')
  })
}

function submit() {
  emits('submit', { hide, show })
}

function hide() {
  emits('hide')
  open.value = false
  nextTick(() => {
    emits('hidden')
  })
}
</script>

<template>
  <span :class="{ 'd-inline-block': tag }">
    <slot v-if="!props.notActivator" name="activator" :show="show" :hide="hide" :attrs="props.tagAttrs">
      <component id="c-modal-component" :is="props.tag" v-bind="props.tagAttrs" @click.stop="show">
        <font-awesome-icon v-if="icon" id="c-modal-icon" :icon="icon" :class="[iconClass, 'align-middle me-1']" />

        {{ label }}
      </component>
    </slot>

    <RModal v-model="open" v-bind="$attrs" @hide="hide">
      <slot :open="open" :show="show" :hide="hide"></slot>

      <template #modal-footer>
        <slot name="actions" :submit="submit" :hide="hide">
          <div class="row flex-grow-1">
            <div class="col-6">
              <RButton variant="success" block class="text-nowrap" :disabled="props.progressing" @click="submit">
                {{ $t('shared.save') }}
              </RButton>
            </div>

            <div class="col-6">
              <RButton variant="secondary" block class="text-nowrap" @click="hide">
                {{ $t('shared.return') }}
              </RButton>
            </div>
          </div>
        </slot>
      </template>
    </RModal>
  </span>
</template>
