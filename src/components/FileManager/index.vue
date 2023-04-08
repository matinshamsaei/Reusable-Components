<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import FBreadcrumb from './Breadcrumb.vue'
import FCreateFolder from './CreateFolder.vue'
import FFiles from './Files.vue'
import FFooter from './Footer.vue'
import FRename from './Rename.vue'
import FToolbar from './Toolbar.vue'
import Uploader from './Uploader.vue'
import useErrors from '../../composable/useErrors'
import useGlobalProps from '../../composable/useGlobalProps'
import useTranslations from '../../composable/useTranslations'
import { isObject } from '../../utils/object'

const model = ref('')

const globalProps = useGlobalProps()

type ApiTypes = {
  getFolderByPath: Function
  createFolder: Function
  deleteFolder: Function
  deleteDoc: Function
  moveDoc: Function
  copyDoc: Function
  moveFolder: Function
  copyFolder: Function
  renameDoc: Function
  renameFolder: Function
  upload: Function
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

type Props = {
  api: ApiTypes
  picker?: boolean
  isMember?: boolean
  docType?: 'IMAGE' | 'FILE' | 'MEDIA'
}

const props = withDefaults(defineProps<Props>(), {
  picker: false,
  isMember: false,
  docType: 'FILE'
})

const folderItems = ref<object[]>([])
let selected: ModelType = reactive({})
const progressing = ref(true)
const path = ref<string>('')
const createFolderOpen = ref(false)
const uploaderOpen = ref(false)
const clipboard: ClipBoard = reactive({ item: {}, action: '' })
let renameItem = ref<ModelType>({})

onMounted(() => {
  refresh()
})

const breadcrumbItems = computed(() => {
  var secs = path.value.split('/').filter((s) => s.trim().length)
  if (secs.length < 1) return []
  let result = []
  for (let i = 0; i < secs.length; i++) {
    const prevPath: string = i === 0 ? '' : result[i - 1].path
    const sec = secs[i]
    result.push({
      name: sec,
      path: `${prevPath}/${sec}`
    })
  }
  return result
})

function copy(item: ModelType) {
  clipboard.item = item
  clipboard.action = 'copy'
}

function open(item: ModelType) {
  if (item.folder && item.path && !props.isMember) return getFolder(item.path)
  let schema = globalProps.$config.ssl ? 'https://' : 'http://'
  const url = `${schema}${globalProps.$config.files.thumbServer}/${globalProps.$config.prefixUrl}${item.url}`
  window.open(url, '_blank')
}

function cut(item: ModelType) {
  clipboard.item = item
  clipboard.action = 'cut'
}

async function paste() {
  let promise = null
  if (`${path.value}/${clipboard.item.name}` === clipboard.item.path) {
    clipboard.item = {}
    clipboard.action = ''
  } else if (clipboard.item.folder && !props.isMember) {
    if (clipboard.action === 'cut') {
      if (clipboard.item.path && path.value.startsWith(clipboard.item.path))
        throw new Error(useTranslations('fileManager.cantMoveFolderToItself'))
      else {
        progressing.value = true
        promise = props.api.moveFolder(props.docType, clipboard.item.path, path.value)
      }
    } else {
      progressing.value = true
      promise = props.api.copyFolder(props.docType, clipboard.item.path, path.value)
    }
  } else {
    if (clipboard.action === 'cut')
      promise = props.api.moveDoc(props.docType, clipboard.item.path, `${path.value}/${clipboard.item.name}`)
    else promise = props.api.copyDoc(props.docType, clipboard.item.path, `${path.value}/${clipboard.item.name}`)
  }
  if (!promise) return

  try {
    await promise
    clipboard.item = {}
    clipboard.action = ''
    refresh()
  } catch (err: any) {
    if (typeof err === 'object') useErrors(err)
  }
}

async function remove(item: any) {
  try {
    let promise
    if (item.folder && !props.isMember) promise = props.api.deleteFolder(props.docType, item.path)
    else promise = props.api.deleteDoc(props.docType, item.path)

    await promise

    refresh()
  } catch (err) {
    if (typeof err === 'object') useErrors(err)
  }
}

function refresh() {
  return getFolder(path.value)
}

function openCreateFolderDialog() {
  createFolderOpen.value = true
}

function openRenameDialog(item: ModelType) {
  renameItem.value = item
}

function closeCreateFolderDialog() {
  createFolderOpen.value = false
}

function closeRenameDialog() {
  renameItem.value = {}
}

function openUploaderDialog() {
  uploaderOpen.value = true
}

function closeUploaderDialog(docs: string) {
  if (docs && docs.length) refresh()
  uploaderOpen.value = false
}

function select(item: ModelType) {
  Object.assign(selected, item)
}

async function getFolder(folderPath: string) {
  try {
    progressing.value = true
    path.value = folderPath
    const res = await props.api.getFolderByPath(props.docType, path.value)
    folderItems.value = res.folders.map((f: any) => ({
      url: f.url,
      path: f.path,
      name: f.name,
      folder: true
    }))
    folderItems.value = folderItems.value.concat(
      res.docs.map((d: any) => ({
        url: d.url,
        path: d.path,
        name: d.name,
        size: d.size,
        folder: false
      }))
    )
    progressing.value = false
  } catch (err) {
    if (typeof err === 'object') useErrors(err)
    progressing.value = false
  }
}

async function createFolder(name: string) {
  try {
    if (!props.isMember) {
      const createPathFolder: string = `${path.value}/${name}`
      await props.api.createFolder(props.docType, createPathFolder)
    }
    refresh()
  } catch (err) {
    if (typeof err === 'object') useErrors(err)
  }
}

async function rename(newName: string) {
  try {
    let promise: Function
    if (renameItem.value.folder && !props.isMember)
      promise = props.api.renameFolder(props.docType, path.value, renameItem.value.name, newName)
    else promise = props.api.renameDoc(props.docType, path.value, renameItem.value.name, newName)

    await promise
    refresh()
  } catch (err) {
    if (typeof err === 'object') useErrors(err)
  }
}

interface Emit {
  (e: 'pick', value: any): void
  (e: 'close'): void
}

const emit = defineEmits<Emit>()

function emitPick() {
  let schema = globalProps.$config.ssl ? 'https://' : 'http://'
  const url = `${schema}${globalProps.$config.files.thumbServer}/${globalProps.$config.files.prefixUrl}${selected.url}`

  emit('pick', url)
  emitClose()
}

function emitClose() {
  emit('close')
}
</script>

<template>
  <FToolbar
    :progressing="progressing"
    :isMember="props.isMember"
    @openCreateFolder="openCreateFolderDialog"
    @openUploader="openUploaderDialog"
    @refresh="refresh"
  />

  <FBreadcrumb :items="breadcrumbItems" @click="getFolder" />

  <FFiles
    :items="folderItems"
    :class="{ 'rounded-bottom': !picker }"
    :progressing="progressing"
    :picker="picker"
    :selected="selected"
    :clipboard="clipboard"
    :isMember="props.isMember"
    @select="select"
    @folder="getFolder"
    @copy="copy"
    @open="open"
    @cut="cut"
    @paste="paste"
    @remove="remove"
    @rename="openRenameDialog"
  />

  <FFooter v-if="picker" class="rounded-bottom" :selected="selected" @confirm="emitPick" @cancel="emitClose" />

  <FCreateFolder v-if="createFolderOpen && !props.isMember" @confirm="createFolder" @cancel="closeCreateFolderDialog" />

  <Uploader
    v-if="uploaderOpen"
    v-model="model"
    :path="path"
    :api="props.api"
    :doc-type="docType"
    @close="closeUploaderDialog"
  />

  <FRename
    v-if="!!isObject(renameItem)"
    :old-name="renameItem.name ? renameItem.name : ''"
    @confirm="rename"
    @cancel="closeRenameDialog"
  />
</template>
