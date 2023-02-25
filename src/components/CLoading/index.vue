<template>
  <div class="text-center" :class="{ 'mb-3': !props.hideBottomSpace }">
    <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  hideBottomSpace?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideBottomSpace: false
})
</script>
