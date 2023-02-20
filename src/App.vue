<script setup lang="ts">
import useGlobalProps from './composable/useGlobalProps'
import { RLink, RImg } from '@routaa/ui-kit'
import Thumbnail from './components/Thumbnail/index.vue'

const globalProps = useGlobalProps()

console.log(globalProps.$config)
</script>

<template>
  welcome to shared components
  <RImg src="http://192.168.7.16:800/unsafe/fit-in/business/files/site-widget/header/47013ec539c143afab2b8445a306fb3b.png"/>
  <Thumbnail src="/site-widget/header/47013ec539c143afab2b8445a306fb3b.png" />
</template>
