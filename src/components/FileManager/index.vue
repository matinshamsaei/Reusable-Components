<template>
  <div>
    <FToolbar
      :progressing="progressing"
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
      @select="select"
      @folder="getFolder"
      @copy="copy"
      @open="open"
      @cut="cut"
      @paste="paste"
      @remove="remove"
      @rename="openRenameDialog"
      :clipboard="clipboard"
    />

    <FFooter v-if="picker" class="rounded-bottom" :selected="selected" @confirm="emitPick" @cancel="emitClose" />
    <FCreate-folder v-if="createFolderOpen" @confirm="createFolder" @cancel="closeCreateFolderDialog" />
    <FUploader v-if="uploaderOpen" :api="api" :doc-type="docType" :path="path" @close="closeUploaderDialog" />
    <FRename v-if="!!renameItem" :old-name="renameItem.name" @confirm="rename" @cancel="closeRenameDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import FBreadcrumb from './Breadcrumb.vue'
import FCreateFolder from './CreateFolder.vue'
import FFiles from './Files.vue'
import FFooter from './Footer.vue'
import FRename from './Rename.vue'
import FToolbar from './Toolbar.vue'
import FUploader from './Uploader.vue'
import useGlobalProps from '../../composable/useGlobalProps'

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
  docType?: 'IMAGE' | 'FILE' | 'MEDIA'
}

const props = withDefaults(defineProps<Props>(), {
  picker: false,
  docType: 'FILE'
})

const folderItems = ref<string[]>([])
const selected = ref('')
const progressing = ref(true)
const path = ref<string>('')
const createFolderOpen = ref(false)
const uploaderOpen = ref(false)
const clipboard: ClipBoard = reactive({ item: {}, action: '' })
const renameItem = ref('')

type Error = {
  data?: string
  errorCode?: number
  status?: number
  code?: number
}

function errorHandler(errors: Error | Error[] | null) {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      if (typeof error === 'object') throwError(error)
    })
  } else throwError(errors)
}

const throwError = (error: Error | null): void => {
  if (error && error.data) throw new Error(error.data)
}

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
  if (item.folder && item.path) return getFolder(item.path)
  let schema = globalProps.$config.ssl ? 'https://' : 'http://'
  const url = `${schema}${globalProps.$config.files.thumbServer}/${globalProps.$config.files.prefixUrl}${item.url}`
  window.open(url, '_blank')
}

function cut(item: ModelType) {
  clipboard.item = item
  clipboard.action = 'cut'
}

async function paste() {
  let promise = null
  if (`${path}/${clipboard.item.name}` === clipboard.item.path) {
    clipboard.item = {}
    clipboard.action = ''
  } else if (clipboard.item.folder) {
    if (clipboard.action === 'cut') {
      if (clipboard.item.path && path.value.startsWith(clipboard.item.path)) {
        // this.$showError(this.$t('fileManager.cantMoveFolderToItself'))
      } else {
        progressing.value = true
        promise = props.api.moveFolder(props.docType, clipboard.item.path, path)
      }
    } else {
      progressing.value = true
      promise = props.api.copyFolder(props.docType, clipboard.item.path, path)
    }
  } else {
    if (clipboard.action === 'cut') {
      promise = props.api.moveDoc(props.docType, clipboard.item.path, `${path}/${clipboard.item.name}`)
    } else {
      promise = props.api.copyDoc(props.docType, clipboard.item.path, `${path}/${clipboard.item.name}`)
    }
  }
  if (!promise) return

  try {
    await promise
    clipboard.item = {}
    clipboard.action = ''
    refresh()
  } catch (err) {
    // this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
    if (typeof err === 'object') errorHandler(err)
  }
}

function remove(item: string) {
  console.log(item)
  // this.$confirm().then(() => {
  //   let promise
  //   if (item.folder) promise = props.api.deleteFolder(props.docType, item.path)
  //   else promise = props.api.deleteDoc(props.docType, item.path)
  //   promise
  //     .catch((err) => {
  //       this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
  //     })
  //     .then(() => {
  //       this.refresh()
  //     })
  // })
}

function refresh() {
  getFolder(path.value)
}

function openCreateFolderDialog() {
  createFolderOpen.value = true
}

function openRenameDialog(item: string) {
  renameItem.value = item
}

function closeCreateFolderDialog() {
  createFolderOpen.value = false
}

function closeRenameDialog() {
  renameItem.value = ''
}

function openUploaderDialog() {
  uploaderOpen.value = true
}

function closeUploaderDialog(docs: string) {
  if (docs && docs.length) refresh()
  uploaderOpen.value = false
}

function select(item: string) {
  selected.value = item
}

async function getFolder(path: string) {
  try {
    progressing.value = true
    path = path
    const res = await props.api.getFolderByPath(props.docType, path)
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
    if (typeof err === 'object') errorHandler(err)
    progressing.value = false
  }
}

async function createFolder(name: string) {
  try {
    const createPathFolder: string = `${path}/${name}`
    await props.api.createFolder(props.docType, createPathFolder)
    refresh()
  } catch (err) {
    if (typeof err === 'object') errorHandler(err)
  }
}

async function rename(newName: string) {
  try {
    let promise: Function
    if (renameItem.folder) {
      promise = props.api.renameFolder(props.docType, path, renameItem.name, newName)
    } else {
      promise = props.api.renameDoc(props.docType, path, renameItem.name, newName)
    }
    await promise()
    refresh()
  } catch (err) {
    if (typeof err === 'object') errorHandler(err)
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
