<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { RModal } from '@routaa/ui-kit'
import FileManager from '@/components/FileManager/index.vue'
import $t from '@/composable/useTranslations'
import useGlobalProps from '@/composable/useGlobalProps'
import 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/searchreplace'
import 'tinymce/icons/default'

type Props = {
  title?: string
  titleClass?: string
  disabled?: boolean
  modelValue?: string
  cssUrl?: string
  height?: number | string
  maxHeight?: number | string
  resize?: boolean
  elementpath?: boolean
  docsApi: object
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  resize: false,
  elementpath: true
})

type Emits = {
  (e: 'input', id: any): void
  (e: 'update:modelValue', val: any): void
}

const emits = defineEmits<Emits>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

function emitInput(val: any) {
  emits('input', val)
}

const fmodal = ref()

/*
  Tinymce Config
*/

const globalProps = useGlobalProps()

const language = globalProps.$config.locale === 'fa' ? 'fa' : undefined

const simple = false,
  full = true

let toolbarItems = [
  {
    undo: full,
    redo: full
  },
  {
    bold: simple,
    italic: simple
  },
  {
    alignleft: simple,
    aligncenter: simple,
    alignright: simple,
    alignjustify: simple
  },
  {
    bullist: simple,
    numlist: simple
  },
  {
    table: full
  },
  {
    outdent: full,
    indent: full
  },
  {
    forecolor: full,
    backcolor: full
  },
  {
    image: full,
    media: full
  },
  {
    rtl: simple,
    ltr: simple
  },
  {
    searchreplace: full
  },
  {
    fullscreen: full,
    code: full
  }
]

let toolbar = ''

toolbarItems.forEach((group) => {
  Object.keys(group).forEach((btn) => {
    toolbar += !simple || (simple && group[btn] === simple) ? `${btn} ` : ''
  })
  toolbar += ' | '
})

let content_css = [`/tinymce/content/default/content.css?v=${new Date().getTime()}`]

if (props.cssUrl) content_css.push(`${props.cssUrl}?v=${new Date().getTime()}`)

// const vm = this
const isVisible = ref(false)

const fileManager = reactive({
  open: false,
  callback: null,
  docType: null,
  value: null
})

const tinymceConfig = reactive({
  extended_valid_elements: '*[*]',
  skin_url: '/tinymce/ui/oxide',
  directionality: $t('direction'),
  language_url: `/tinymce/langs/${language}.js`,
  language,
  content_css,
  plugins: [
    'table',
    'fullscreen',
    'code',
    'paste',
    'link',
    'directionality',
    'lists',
    'advlist',
    'autoresize',
    'code',
    'image',
    'media',
    'hr',
    'fullscreen',
    'table',
    'wordcount',
    'searchreplace'
  ],
  menubar: simple ? '' : 'edit view insert format tools table',
  toolbar,
  min_height: props.height,
  max_height: props.maxHeight,
  autoresize_bottom_margin: 30,
  resize: props.resize,
  branding: false,
  elementpath: props.elementpath,
  table_default_attributes: { class: 'table' },
  table_default_styles: {},
  table_class_list: [
    { title: 'None', value: 'table' },
    { title: 'Striped Rows', value: 'table table-striped' },
    { title: 'Bordered', value: 'table table-bordered' },
    { title: 'Bordered Striped Rows', value: 'table table-bordered table-striped' },
    { title: 'Borderless', value: 'table table-borderless' },
    { title: 'Hoverable', value: 'table table-hover' },
    { title: 'Small', value: 'table table-sm' },
    { title: 'Small Striped Rows', value: 'table table-sm table-striped' },
    { title: 'Small Bordered', value: 'table table-sm table-bordered' },
    { title: 'Small Bordered Striped Rows', value: 'table table-sm table-bordered table-striped' },
    { title: 'Small Borderless', value: 'table table-sm table-borderless' },
    { title: 'Small Hoverable', value: 'table table-sm table-hover' }
  ],
  table_row_class_list: [
    { title: 'None', value: '' },
    { title: 'Primary', value: 'table-primary' },
    { title: 'Success', value: 'table-success' },
    { title: 'Danger', value: 'table-danger' },
    { title: 'Info', value: 'table-info' },
    { title: 'Warning', value: 'table-warning' },
    { title: 'Active', value: 'table-active' },
    { title: 'Secondary', value: 'table-secondary' },
    { title: 'Light', value: 'table-light' },
    { title: 'Dark', value: 'table-dark' }
  ],
  table_cell_class_list: [
    { title: 'None', value: '' },
    { title: 'Primary', value: 'table-primary' },
    { title: 'Success', value: 'table-success' },
    { title: 'Danger', value: 'table-danger' },
    { title: 'Info', value: 'table-info' },
    { title: 'Warning', value: 'table-warning' },
    { title: 'Active', value: 'table-active' },
    { title: 'Secondary', value: 'table-secondary' },
    { title: 'Light', value: 'table-light' },
    { title: 'Dark', value: 'table-dark' }
  ],
  file_picker_callback(callback: any, value: any, meta: any) {
    fileManager.callback = callback
    fileManager.value = value
    fileManager.docType = meta.filetype.toUpperCase() // image | file | media

    openFileManager()
  }
})

function openFileManager() {
  fileManager.open = true
  isVisible.value = true
}
/*
  End Tinymce Config
*/

function closeFileManager() {
  fileManager.open = false
  isVisible.value = false
}

function pick(fileUrl: any) {
  if (fileManager.callback) fileManager.callback(fileUrl)
}
</script>

<template>
  <h6 v-if="props.title" class="tinymce-title" :class="props.titleClass">{{ props.title }}</h6>

  <editor :disabled="disabled" :initial-value="model" v-model="model" @input="emitInput" :init="tinymceConfig" />

  <RModal
    v-model="isVisible"
    size="xl"
    body-class="p-0"
    centered
    no-fade
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    lazy
    @hide="closeFileManager"
    :title="$t('fileManager.mediaGallery')"
  >
    <file-manager picker :doc-type="fileManager.docType" @pick="pick" @close="closeFileManager" :api="props.docsApi" />
  </RModal>
</template>
