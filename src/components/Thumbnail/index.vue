<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import type { HTMLAttributes, StyleValue, ImgHTMLAttributes } from 'vue'
import { RLink, RImg } from '@routaa/ui-kit'
import useGlobalProps from '../../composable/useGlobalProps'

const globalProps = useGlobalProps()

type Target = '_self' | '_blank' | '_parent' | '_top' | 'framename'

type Props = {
  src: string
  prefixUrl?: string
  fitIn?: boolean
  width?: number | string
  height?: number | string
  link?: boolean
  to?: string
  imgClass?: HTMLAttributes['class']
  imgStyle?: StyleValue
  target?: Target
  placeholder?: string
  effects?: object
  gif?: boolean
  fluidGrow?: boolean
  fluid?: boolean
  showNoImage?: boolean
  noImageUrl?: string
}

type LinkAttrs = {
  href?: string
  to?: string
  target?: Target
}

type ImgAttrs = Pick<ImgHTMLAttributes, 'src' | 'alt' | 'class' | 'style' | 'width' | 'height'> & {
  fluid?: boolean
  fluidGrow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fitIn: false,
  link: false,
  target: '_self',
  gif: false,
  fluidGrow: false,
  fluid: false,
  showNoImage: false
})

const $attrs = useAttrs()

const isGifMode = computed(() => {
  return props.gif
})

const tag = computed(() => {
  return props.link || props.to ? RLink : 'span'
})

const tagAttrs = computed<LinkAttrs>(() => {
  const attrs: LinkAttrs = {}

  if (props.link) {
    attrs.href = staticUrl.value
    attrs.target = '_blank'
  } else if (props.to) {
    attrs.to = props.to
    attrs.target = props.target
  }

  return attrs
})

const imgAttrs = computed<ImgAttrs>(() => {
  const attrs: ImgAttrs = {
    ...$attrs,
    fluid: props.fluid,
    fluidGrow: props.fluidGrow
  }
  delete attrs.class
  delete attrs.style

  if (props.imgClass) attrs.class = props.imgClass
  if (props.imgStyle) attrs.style = props.imgStyle

  const freeSize = props.fitIn && props.src
  if (props.width && !freeSize) attrs.width = props.width
  if (props.height && !freeSize) attrs.height = props.height

  return attrs
})

const staticUrl = computed(() => {
  return globalProps.$config.thumbor.files.createStaticUrl(props.prefixUrl, props.src)
})

const mediaSrc = (format: string = ''): string => {
  if (props.src) {
    if (props.showNoImage) return props.noImageUrl || ''
  }

  // if src is an external url don't use thumb
  if (props.src.startsWith('http')) return props.src

  if (globalProps.$config.thumbor && globalProps.$config.thumbor.enabled) return thumbUrl(format)

  return staticUrl.value
}

const thumbUrl = (format: string): string => {
  return globalProps.$config.thumbor.createUrl(thumbConfig(format))
}

const thumbConfig = (format: string) => {
  return {
    src: props.src,
    prefixUrl: props.prefixUrl,
    fitIn: props.fitIn,
    width: props.width,
    height: props.height,
    effects: props.effects || {},
    gif: props.gif,
    format
  }
}
</script>

<template>
  <component :is="tag" v-bind="tagAttrs">
    <div v-if="isGifMode" class="video-container">
      <video autoplay loop muted>
        <source :src="mediaSrc('mp4')" type="video/mp4" />
        <source :src="mediaSrc('webm')" type="video/webm" />
      </video>
    </div>

    <RImg v-else :src="mediaSrc()" v-bind="imgAttrs" />
  </component>
</template>
