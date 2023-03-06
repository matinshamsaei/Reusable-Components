<template>
  <div class="position-relative">
    <div class="table-wrap text-left" dir="ltr" @contextmenu="openCtxMenu">
      <RTable
        small
        stacked="sm"
        hover
        bordered
        :empty-text="useTranslations('shared.noRecords')"
        :empty-filtered-text="useTranslations('shared.noMatchingRecords')"
        show-empty
        :fields="fields"
        :items="files"
        :busy="progressing"
        class="mb-0"
        selectable
        select-mode="single"
        :tbody-tr-class="getRowClass"
        @row-selected="rowSelected"
        @row-contextmenu="rowContextMenu"
      >
        <template #cell(name)="data">
          <font-awesome-icon size="lg" class="mx-2" :icon="data.item.icon" :class="getIconClass(data.item)" />
          <span> {{ data.item.name }} </span>
        </template>

        <template #cell(type)="data">
          <strong v-if="data.item.folder">{{ data.item.type }}</strong>

          <span class="small" v-else>{{ data.item.type }}</span>
        </template>

        <div slot="table-busy" class="text-center text-danger my-5" :dir="useTranslations('direction')">
          <CLoading class="align-middle"></CLoading>

          <strong class="mx-3">{{ useTranslations('fileManager.loading') }} ...</strong>
        </div>
      </RTable>
    </div>

    <RListGroup v-if="ctxMenu.open" class="ctx-menu shadow-sm" :style="ctxMenuPosStyle">
      <RListGroupItem class="py-2 px-1" button @click="emitOpen" v-if="ctxMenu.item">
        <font-awesome-icon icon="eye" fixed-width class="text-muted align-middle mx-1" />
        {{ useTranslations('forms.open') }}
      </RListGroupItem>

      <RListGroupItem class="py-2 px-1" button @click="emitCopy" v-if="ctxMenu.item">
        <font-awesome-icon icon="copy" fixed-width class="text-muted align-middle mx-1" />
        {{ useTranslations('fileManager.copy') }}
      </RListGroupItem>

      <RListGroupItem class="py-2 px-1" button @click="emitCut" v-if="ctxMenu.item">
        <font-awesome-icon icon="scissors" fixed-width class="text-muted align-middle mx-1" />
        {{ useTranslations('fileManager.cut') }}
      </RListGroupItem>

      <RListGroupItem
        class="py-2 px-1"
        :class="{ 'bg-light': !clipboard?.item }"
        button
        :disabled="!clipboard?.item"
        @click="emitPaste"
      >
        <font-awesome-icon
          icon="paste"
          fixed-width
          class="align-middle mx-1"
          :class="{ 'text-muted': clipboard?.item, 'text-moremuted': !clipboard?.item }"
        />

        {{ useTranslations('fileManager.paste') }}
      </RListGroupItem>

      <RListGroupItem class="py-2 px-1" button @click="emitRename" v-if="ctxMenu.item">
        <font-awesome-icon icon="italic" fixed-width class="text-muted align-middle mx-1" />

        {{ useTranslations('fileManager.rename') }}
      </RListGroupItem>

      <RListGroupItem class="py-2 px-1" button @click="emitRemove" v-if="ctxMenu.item">
        <font-awesome-icon icon="trash" fixed-width class="text-muted align-middle mx-1" />

        {{ useTranslations('fileManager.remove') }}
      </RListGroupItem>
    </RListGroup>
  </div>

  <div
    v-if="ctxMenu.open"
    class="ctx-menu-backdrop"
    @contextmenu.prevent="removeCtxMenuItem"
    @keyup.esc="removeCtxMenuItem"
    @click="removeCtxMenuItem"
    tabindex="0"
  />
</template>

<script setup lang="ts">
import { RTable, RListGroupItem } from '@routaa/ui-kit'
import CLoading from '../CLoading/index.vue'
import { computed, watch, reactive, ref } from 'vue'
import useTranslations from '@/composable/useTranslations'

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

type Props = {
  items?: object[]
  picker?: boolean
  progressing: boolean
  clipboard?: ClipBoard
}

const props = withDefaults(defineProps<Props>(), {
  picker: false
})

const fields = ref([
  {
    key: 'name',
    label: useTranslations('fileManager.fileName')
  },
  {
    key: 'type',
    label: useTranslations('fileManager.type')
  }
])

type CtxMenuType = {
  [x: string]: any
  open?: boolean
  item?: string
  x?: number
  y?: number
}

const ctxMenu = reactive({
  open: false,
  item: null,
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

const files = computed(() => {
  return (props.items as any[]).map((i: ModelType) => {
    i.type = i.folder ? 'folder' : getType(i)
    i.icon = getIcon(i)
    return i
  })
})

watch(
  () => ctxMenu.item,
  (val) => {
    if (!val) {
      window.removeEventListener('keyup', onEscapeKeyUp)
    } else {
      window.addEventListener('keyup', onEscapeKeyUp)
    }
  }
)

const ctxMenuPosStyle = computed(() => {
  return {
    left: `${ctxMenu.x}px`,
    top: `${ctxMenu.y}px`
  }
})

function emitCopy() {
  emit('copy', ctxMenu.item)
  removeCtxMenuItem()
}

function emitOpen() {
  emit('open', ctxMenu.item)
  removeCtxMenuItem()
}

function emitCut() {
  emit('cut', ctxMenu.item)
  removeCtxMenuItem()
}

function emitRename() {
  emit('rename', ctxMenu.item)
  removeCtxMenuItem()
}

function emitRemove() {
  emit('remove', ctxMenu.item)
  removeCtxMenuItem()
}

function emitPaste() {
  emit('paste')
  removeCtxMenuItem()
}

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

function rowContextMenu(item: null, e: { preventDefault: () => void; layerX: number; layerY: number }) {
  e.preventDefault()
  ctxMenu.open = true
  ctxMenu.item = item
  ctxMenu.x = e.layerX
  ctxMenu.y = e.layerY
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
  }
  return cls
}

function rowSelected(items: any[]) {
  const item = items[0]
  emit('select', item && !item.folder ? item : null)
  if (item && item.folder) emit('folder', item.path)
}

function openCtxMenu(e: CtxMenuType) {
  e.preventDefault()
  ctxMenu.open = true
  ctxMenu.x = e.layerX
  ctxMenu.y = e.layerY
}
</script>
