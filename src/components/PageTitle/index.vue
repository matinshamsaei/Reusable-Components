<script setup lang="ts">
type Props = {
  size?: string
  title: string
  icon?: string
  simple?: boolean
  noTopSpace?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'list',
  simple: true,
  noTopSpace: true
})
</script>

<template>
  <div class="d-flex align-items-center text-primary" :class="[{ 'mb-4': props.simple }, { 'py-2': props.noTopSpace }]">
    <font-awesome-icon :size="props.size" :icon="props.icon" class="me-2 my-auto" />

    <h6 class="mb-0">
      {{ props.title }}
    </h6>
  </div>
</template>
