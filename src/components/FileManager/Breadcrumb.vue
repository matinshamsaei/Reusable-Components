<script setup lang="ts">
import { RLink } from '@routaa/ui-kit'

type Items = {
  name: string
  path: string
}

type Props = {
  items: Items[]
}

const props = defineProps<Props>()

interface Emit {
  (e: 'click', value: any): void
}

const emit = defineEmits<Emit>()

function emitClick(path: any) {
  emit('click', path.path)
}
</script>

<template>
  <ol dir="ltr" class="breadcrumb m-0 px-3 py-2 bg-light border-bottom">
    <li class="breadcrumb-item">
      <span v-if="!props.items.length">
        <font-awesome-icon icon="house" class="align-middle" />
      </span>

      <RLink @click="emitClick({ path: '/' })" v-else>
        <font-awesome-icon icon="house" class="align-middle" />
      </RLink>
    </li>

    <li
      v-for="(path, index) in props.items"
      :key="path.path"
      class="breadcrumb-item"
      :class="{ active: index == props.items.length - 1 }"
    >
      <span v-if="index == props.items.length - 1">
        {{ path.name }}
      </span>

      <RLink @click="emitClick(path)" v-else>
        {{ path.name }}
      </RLink>
    </li>
  </ol>
</template>
