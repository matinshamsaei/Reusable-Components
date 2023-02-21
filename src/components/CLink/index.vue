<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import { RLink, RListGroupItem, RDropdownItem } from '@routaa/ui-kit'

type Props = {
  tag?: string
  to?: string
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top' | 'framename'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'r-link'
})

const tag = computed(() => {
  if (props.tag === 'RLink' || 'r-link') return RLink
  if (props.tag === 'RListGroupItem' || 'r-list-group-item') return RListGroupItem
  if (props.tag === 'RDropdownItem' || 'r-dropdown-item') return RDropdownItem
})

const inputAttrs = useAttrs()
const router = useRouter()

const attrs = computed(() => {
  const attrs = { ...inputAttrs }
  const to = props.to || props.href
  if (!to) return attrs
  if (isAbsoluteUrl(to)) {
    try {
      const url = new URL(to)
      attrs.href = url.href
      return attrs
    } catch (error) {
      console.error(error)
    }
  }
  let nextRoute = router.resolve(to)
  // add permanent query to next route if exist in current and doesnt exist in next route
  nextRoute = router.resolve(nextRoute)
  if (isAbsoluteUrl(nextRoute.href)) {
    attrs.href = nextRoute.href.replace('/', '')
    return attrs
  }
  attrs.to = nextRoute.href
  return attrs
})

function isAbsoluteUrl(str: string) {
  const pattern = new RegExp(
    '^((http(s?))?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}
</script>

<template>
  <component id="c-link" :is="tag" v-bind="attrs" :target="props.target">
    <slot></slot>
  </component>
</template>
