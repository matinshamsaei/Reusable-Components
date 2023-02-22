<template>
  <b-tabs
    nav-class="border-0"
    :nav-wrapper-class="['border-0', wrapperClass]"
    :content-class="contentClass + ' border-0'"
    :card="card"
    :active-nav-item-class="activeNavClass"
    :class="{ bordered: hasBorder }"
  >
    <b-tab
      v-for="item in items"
      :key="item.value"
      :title="item.text"
      :active="tabQueryEquality(item.value)"
      :lazy="lazy"
      :class="tabClass"
      @click="tabClick(item.value)"
    >
      <component v-if="item.component" :is="item.component"></component>

      <slot name="tab"></slot>
    </b-tab>
  </b-tabs>
</template>

<script setup lang="ts">
// import { BTabs, BTab } from 'bootstrap-vue'
// import { serializer } from '@/lib/util'

type Props = {
  items?: []
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

function tabClick(value) {
  //     if (value != this.$route.query.tab) {
  //       let qs = {}
  //       qs.tab = value
  //       this.$router.push(`?${serializer(qs)}`)
  //       this.emitChange(value)
  //     }
}

function changeTab() {
  //     this.items.forEach((item, index) => {
  //       if (item.value == this.$route.query.tab) {
  //         this.activeTabIndex = index
  //         this.$nextTick(() => this.tabClick(this.$route.query.tab))
  //       }
  //     })
}

function emitChange(value) {
//     if (this.$route.query.tab !== value) this.$emit('change', value)
}

function tabQueryEquality(value) {
//     return this.$route.query.tab == value
}

// watch: {
//   '$route.query.tab'() {
//     this.changeTab()
//   }
// },
// mounted() {
//   if (this.$route.query.tab) this.changeTab()
// }
</script>
