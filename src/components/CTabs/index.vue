<script setup lang="ts">
import { ref, nextTick, onMounted, watch, type Component } from 'vue'
import { RTabs, RTab } from '@routaa/ui-kit'
import { useRouter, useRoute } from 'vue-router'
import { serializer } from '@/lib/utils'

const router = useRouter()

const route = useRoute()

const activeTabIndex = ref<number>(0)

interface Emit {
  (e: 'change', value: any): void
}

const emit = defineEmits<Emit>()

type Items = {
  text: string
  value: any
  component?: Component | string | object
}

type Props = {
  items?: Items[]
  card?: boolean
  lazy?: boolean
  hasBorder?: boolean
  activeNavClass?: string
  contentClass?: string
  tabClass?: string
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  card: false,
  lazy: true,
  hasBorder: false,
  tabClass: 'm-1'
})

watch(
  () => route.query.tab,
  () => {
    changeTab()
  }
)

onMounted(() => {
  if (route.query.tab) changeTab()
})

function tabClick(value: string) {
  if (value != route.query.tab) {
    let qs: { tab?: string } = {}
    qs.tab = value
    router.push(`?${serializer(qs)}`)
    emitChange(value)
  }
}

function changeTab() {
  props.items &&
    props.items.length &&
    props.items.forEach((item, index) => {
      if (item.value == route.query.tab) {
        activeTabIndex.value = index
        nextTick(() => tabClick((typeof route.query.tab === 'string' && route.query.tab) || ''))
      }
    })
}

function emitChange(value: string) {
  if (route.query.tab !== value) emit('change', value)
}

function tabQueryEquality(value: object) {
  return route.query.tab == value
}
</script>

<template>
  <RTabs
    nav-class="border-0"
    :nav-wrapper-class="['border-0', wrapperClass]"
    :content-class="contentClass + ' border-0'"
    :card="props.card"
    :active-nav-item-class="activeNavClass"
    :class="{ bordered: props.hasBorder }"
  >
    <RTab
      v-for="item in items"
      :key="item.value"
      :title="item.text"
      :active="tabQueryEquality(item.value)"
      :lazy="props.lazy"
      :class="props.tabClass"
      @click="tabClick(item.value)"
    >
      <component v-if="item.component" :is="item.component"></component>

      <slot name="tab"></slot>
    </RTab>
  </RTabs>
</template>
