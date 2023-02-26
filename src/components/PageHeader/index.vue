<script setup lang="ts">
import { useAttrs } from 'vue'
import { RButton } from '@routaa/ui-kit'
import PageTitle from '@/components/PageTitle/index.vue'
import CTabs from '@/components/CTabs/index.vue'

const attrs = useAttrs()

const emit = defineEmits<Emits>()

type BtnData = {
  text: string
  icon: string
  color: string
  link: string
}

type SortItems = {
  text: string
  value: string
}

type Props = {
  title: string
  icon?: string
  disableBtn?: boolean
  sortItems?: SortItems[]
  btnData?: BtnData
}

const props = withDefaults(defineProps<Props>(), {
  disableBtn: false
})

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

<template>
  <div v-bind="attrs" class="w-100 mb-4 pt-1 d-flex justify-content-between align-items-center flex-wrap">
    <PageTitle :title="title" :icon="icon" :simple="false" />

    <RButton
      v-if="props.btnData?.text || props.btnData?.icon"
      :disabled="props.disableBtn"
      :variant="props.btnData.color || 'success'"
      :to="props.btnData.link"
      @click="btnClick"
    >
      <font-awesome-icon v-if="props.btnData?.icon" :icon="props.btnData?.icon" class="me-2" />

      <span v-if="props.btnData?.text">{{ props.btnData.text }}</span>
    </RButton>
  </div>

  <div
    v-if="props.sortItems"
    class="mb-4 d-flex justify-content-center justify-content-md-start align-items-center flex-wrap page-header"
  >
    <CTabs :items="props.sortItems" contentClass="bg-transparent" @change="emitChange" />
  </div>
</template>
