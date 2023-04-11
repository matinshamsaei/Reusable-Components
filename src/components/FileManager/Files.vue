<script setup lang="ts">
import { RTable, RListGroupItem, RListGroup } from '@routaa/ui-kit'
import CLoading from '../CLoading/index.vue'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { isObject } from '../../utils/object'
import $t from '@/composable/useTranslations'

const attrs = useAttrs()

type Props = {
  items?: object[]
  picker?: boolean
  progressing: boolean
  clipboard?: ClipBoard
  isMember?: boolean
}

type ModelType = {
  folder?: boolean
  icon?: string
  name?: string
  path?: string
  size?: number
  type?: string
  url?: string
}

type ClipBoard = {
  item: ModelType
  action: string
}

type CtxMenuType = {
  [x: string]: any
  open?: boolean
  item?: object | null
  x?: number
  y?: number
}

type Proxy = {
  item: object
  index: number
  $event: { preventDefault: () => void; layerX: number; layerY: number }
}

const props = withDefaults(defineProps<Props>(), {
  picker: false,
  isMember: false
})

const fields = ref([
  {
    key: 'name',
    label: $t('fileManager.fileName')
  },
  {
    key: 'type',
    label: $t('fileManager.type')
  }
])

const ctxMenu: CtxMenuType = reactive({
  open: false,
  item: {},
  x: 0,
  y: 0
})

interface Emit {
  (e: 'copy', value: any): void
  (e: 'open', value: any): void
  (e: 'cut', value: any): void
  (e: 'rename', value: any): void
  (e: 'remove', value: any): void
  (e: 'select', value: any): void
  (e: 'folder', value: any): void
  (e: 'paste'): void
}

const emit = defineEmits<Emit>()

const selectedItem = ref()

const files = computed(() => {
  let items: object[] = []
  if (props.isMember && props.items && props.items.length)
    items = props.items?.filter((item: ModelType) => !item.folder)
  else items = props.items && props.items.length ? props.items : []

  return (items as any[]).map((i: ModelType) => {
    i.type = i.folder ? 'folder' : getType(i)
    i.icon = getIcon(i)
    return i
  })
})

watch(
  () => ctxMenu.item,
  (val) => {
    if (!val) window.removeEventListener('keyup', onEscapeKeyUp)
    else window.addEventListener('keyup', onEscapeKeyUp)
  }
)

const ctxMenuPosStyle = computed(() => {
  return {
    left: `${ctxMenu.x}px`,
    top: `${ctxMenu.y}px`
  }
})

function removeCtxMenuItem() {
  ctxMenu.item = null
  ctxMenu.open = false
}

function onEscapeKeyUp(event: { which: number }) {
  if (event.which === 27) {
    ctxMenu.item = null
    ctxMenu.open = false
  }
}

function getType(item: ModelType) {
  const regex = /(?:\.([^.]+))?$/
  if (item.name) {
    const foundedByRegex = regex.exec(item.name)
    if (foundedByRegex && foundedByRegex[1]) return foundedByRegex[1]
  }
}

function getIcon(item: string | any) {
  const type = item.type.toLowerCase()
  switch (type) {
    case 'folder':
      return 'folder'
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'tif':
    case 'ico':
      return 'file-image'
    case 'html':
    case 'htm':
    case 'php':
    case 'aspx':
      return 'file-code'
    case 'zip':
    case 'gzip':
    case 'rar':
      return 'file-archive'
    case 'mp3':
    case 'wma':
    case 'wav':
      return 'file-audio'
    case 'mp4':
    case '3gp':
    case 'ogg':
    case 'wmv':
    case 'webm':
    case 'flv':
    case 'mov':
      return 'file-video'
    case 'pdf':
      return 'file-pdf'
    case 'doc':
    case 'docx':
      return 'file-word'
    case 'xls':
    case 'xlsx':
    case 'xlsm':
    case 'xltx':
    case 'xltm':
      return 'file-excel'
    case 'ppt':
    case 'pptx':
    case 'pptm':
      return 'file-powerpoint'
    default:
      return 'file'
  }
}

function rowContextMenu(proxy: Proxy) {
  proxy.$event.preventDefault()
  ctxMenu.open = true
  ctxMenu.item = proxy.item
  ctxMenu.x = proxy.$event.layerX
  ctxMenu.y = proxy.$event.layerY
}

function getIconClass(item: ModelType) {
  if (item.folder) return 'text-warning'
  if (item.icon === 'file-image') return 'text-success'
  if (item.icon === 'file-video' || item.icon === 'file-audio') return 'text-info'
  else return 'text-secondary'
}

function getRowClass(item: ModelType) {
  if (!item) return null
  let cls = item && item.folder ? 'bg-light cursor-pointer' : 'cursor-pointer'
  if (props.clipboard?.item && props.clipboard.item.path === item.path) {
    if (props.clipboard.action === 'copy') cls += ' table-warning'
    else if (props.clipboard.action === 'cut') cls += ' table-warning text-muted'
  } else if (selectedItem.value && selectedItem.value.path === item.path) cls += ' table-active'

  return cls
}

function rowSelected(items: any[]) {
  const item = items[0]
  const selectItem = item && !item.folder ? item : null
  emit('select', selectItem)
  selectedItem.value = selectItem
  if (item && item.folder && !props.isMember) emit('folder', item.path)
}

function openCtxMenu(e: CtxMenuType) {
  e.preventDefault()
  ctxMenu.open = true
  ctxMenu.x = e.layerX
  ctxMenu.y = e.layerY
}

function emits(type: any) {
  emit(type, ctxMenu.item)
  removeCtxMenuItem()
}
</script>

<template>
  <div class="position-relative">
    <div class="table-wrap text-left" dir="ltr" v-bind="attrs" @contextmenu="openCtxMenu">
      <RTable
        small
        hover
        stacked
        bordered
        show-empty
        table-class="mb-0"
        :items="files"
        :striped="false"
        :fields="fields"
        :busy="progressing"
        :tbody-tr-class="getRowClass"
        :empty-text="$t('shared.noRecords')"
        @row-selected="rowSelected"
        @row-contextmenu="rowContextMenu"
      >
        <template #name="data">
          <font-awesome-icon size="lg" class="mx-2" :icon="data.item.icon" :class="getIconClass(data.item)" />

          <span> {{ data.item.name }} </span>
        </template>

        <template #type="data">
          <strong v-if="data.item.folder">{{ data.item.type }}</strong>

          <span class="small" v-else>{{ data.item.type }}</span>
        </template>

        <div slot="table-busy" class="text-center text-danger my-5" :dir="$t('direction')">
          <CLoading class="align-middle" />

          <strong class="mx-3">{{ $t('fileManager.loading') }} ...</strong>
        </div>
      </RTable>
    </div>

    <RListGroup v-if="ctxMenu.open" class="ctx-menu shadow-sm ps-0" :style="ctxMenuPosStyle">
      <RListGroupItem
        v-if="ctxMenu.item"
        button
        class="py-2 px-1 list-group-item-action cursor-pointer"
        @click="emits('open')"
      >
        <font-awesome-icon icon="eye" fixed-width class="text-muted align-middle mx-1" />

        {{ $t('forms.open') }}
      </RListGroupItem>

      <RListGroupItem
        v-if="ctxMenu.item && !props.isMember"
        button
        class="py-2 px-1 list-group-item-action cursor-pointer"
        @click="emits('copy')"
      >
        <font-awesome-icon icon="copy" fixed-width class="text-muted align-middle mx-1" />

        {{ $t('fileManager.copy') }}
      </RListGroupItem>

      <RListGroupItem
        v-if="ctxMenu.item && !props.isMember"
        button
        class="py-2 px-1 list-group-item-action cursor-pointer"
        @click="emits('cut')"
      >
        <font-awesome-icon icon="scissors" fixed-width class="text-muted align-middle mx-1" />

        {{ $t('fileManager.cut') }}
      </RListGroupItem>

      <RListGroupItem
        v-if="!props.isMember"
        button
        class="py-2 px-1 list-group-item-action cursor-pointer"
        :disabled="!isObject(clipboard?.item)"
        :class="{ 'bg-light': !isObject(clipboard?.item) }"
        @click="emits('paste')"
      >
        <font-awesome-icon
          icon="paste"
          fixed-width
          class="align-middle mx-1"
          :class="{ 'text-muted': isObject(clipboard?.item), 'text-moremuted': !isObject(clipboard?.item) }"
        />

        {{ $t('fileManager.paste') }}
      </RListGroupItem>

      <RListGroupItem
        class="py-2 px-1 list-group-item-action cursor-pointer"
        button
        @click="emits('rename')"
        v-if="ctxMenu.item"
      >
        <font-awesome-icon icon="italic" fixed-width class="text-muted align-middle mx-1" />

        {{ $t('fileManager.rename') }}
      </RListGroupItem>

      <RListGroupItem
        class="py-2 px-1 list-group-item-action cursor-pointer"
        button
        @click="emits('remove')"
        v-if="ctxMenu.item"
      >
        <font-awesome-icon icon="trash" fixed-width class="text-muted align-middle mx-1" />

        {{ $t('fileManager.remove') }}
      </RListGroupItem>
    </RListGroup>
  </div>

  <div
    v-if="ctxMenu.open"
    tabindex="0"
    class="ctx-menu-backdrop"
    @contextmenu.prevent="removeCtxMenuItem"
    @keyup.esc="removeCtxMenuItem"
    @click="removeCtxMenuItem"
  />
</template>
