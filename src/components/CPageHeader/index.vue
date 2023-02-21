<template>
  <div class="w-100 mb-4 pt-1 d-flex justify-content-between align-items-center flex-wrap">
    <c-page-title :title="title" :icon="icon" :simple="false" />

    <b-btn
      v-if="props.btnData?.text || props.btnData?.icon"
      :disabled="disableBtn"
      :variant="props.btnData.color || 'success'"
      :to="props.btnData.link"
      @click="btnClick"
    >
      <font-awesome-icon v-if="props.btnData?.icon" :icon="props.btnData?.icon" class="me-2" />

      <span v-if="props.btnData?.text">{{ props.btnData.text }}</span>
    </b-btn>
  </div>

  <div
    v-if="props.sortItems"
    class="mb-4 d-flex justify-content-center justify-content-md-start align-items-center flex-wrap page-header"
  >
    <c-tabs :items="props.sortItems" contentClass="bg-transparent" @change="emitChange" />
  </div>
</template>

<script setup lang="ts">
import CTabs from './CTabs/index.vue'
import CPageTitle from '@/components/shared/CPageTitle/index.vue'

type BtnData = {
  text: string
  icon: string
  color: string
  link: string
}

type SortItems = {
  item: string
  value: string
}

type Props = {
  title?: string
  icon?: string
  disableBtn?: boolean
  sortItems?: [SortItems]
  btnData?: BtnData
}

const props = withDefaults(defineProps<Props>(), {
  disableBtn: false
})

const emit = defineEmits<Emits>()

interface Emits {
  (e: 'btnClick'): void
  (e: 'change', value: any): void
}

function btnClick() {
  emit('btnClick')
}

function emitChange(item: any) {
  emit('change', item)
}
</script>
