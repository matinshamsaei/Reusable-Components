<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { RButton } from '@routaa/ui-kit'

const router = useRouter()

type Props = {
  to?: string
  size?: 'sm' | 'md' | 'lg'
  smallGutter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  smallGutter: false,
  size: 'md'
})

const show = computed(() => {
  return window.history.length > 1 || props.to
})

const back = () => {
  if (props.to) router.push(props.to)
  router.go(-1)
}
</script>

<template>
  <RButton
    id="back-btn"
    variant="secondary"
    :disabled="!show"
    :size="props.size"
    :class="props.smallGutter ? 'px-3' : 'px-4'"
    @click.prevent="back"
  >
    <span class="px-2 text-nowrap">
      {{ $t('shared.cancel') }}
    </span>
  </RButton>
</template>
