<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
type Props = {
  hideBottomSpace?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideBottomSpace: false
})
</script>

<template>
  <div v-bind="attrs" class="text-center" :class="{ 'mb-3': !props.hideBottomSpace }">
    <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2" />
  </div>
</template>
