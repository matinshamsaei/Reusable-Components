<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { RLink, RButton } from '@routaa/ui-kit'
import Thumbnail from '../Thumbnail/index.vue'
import useGlobalProps from '@/composables/useGlobalProps'

type Props = {
  model: string
  disabled?: boolean
  prefixUrl?: string
}

interface Emit {
  (e: 'remove', value: string): void
}

const emit = defineEmits<Emit>()

const globalProps = useGlobalProps()

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const imageExtensions = reactive<string[]>(['png', 'jpg', 'jpeg', 'gif', 'tiff', 'webp'])

const getExtension = computed<string>(() => {
  return props.model?.toUpperCase().split('.').pop() || ''
})

const isImage = computed<boolean>(() => {
  return imageExtensions.includes(getExtension.value?.toLowerCase())
})

const staticUrl = () => {
  return `${globalProps.$config.files.staticServerUrl}/dispatch-files/${props.model}`
}

const remove = () => {
  emit('remove', props.model)
}
</script>

<template>
  <div class="item dimensions">
    <Thumbnail
      v-if="isImage"
      :src="props.model"
      fit-in
      fluid
      link
      class="image"
      width="100"
      height="100"
      :prefix-url="props.prefixUrl"
    />

    <RLink v-else target="_blank" class="file" :href="staticUrl">
      {{ getExtension }}
    </RLink>

    <RButton v-if="!props.disabled" size="sm" class="remove-btn" variant="link" @click="remove">
      <font-awesome-icon icon="xmark" class="align-middle" />
    </RButton>
  </div>
</template>
