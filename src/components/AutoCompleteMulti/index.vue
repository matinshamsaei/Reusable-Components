<script lang="ts" setup>
import { computed, onMounted, ref, type HTMLAttributes } from 'vue'
import type { IObject } from '@/utils/object'
import useErrors from '@/composables/useErrors'
import $t from '@/composables/useTranslations'

import {
  RBadge,
  RModal,
  RListGroup,
  RButton,
  RFormInput,
  RInputGroup,
  RListGroupItem,
  RInputGroupAppend,
  RInputGroupPrepend,
  vRFocus
} from '@routaa/ui-kit'

type Props = {
  modelValue: number[]
  valueField?: string
  textField?: string
  modelField?: string | boolean | Function
  prepend?: string
  dir?: string
  extendFilter?: object
  disabled?: boolean
  size?: string
  debounce?: number
  perPage?: number
  default?: boolean
  filterName?: string
  taggable?: boolean
  select?: Function
  search?: Function
  noBadge?: boolean
  noDetails?: boolean
  required?: boolean
  placeholder?: string
  resultClass?: HTMLAttributes['class']
  noBadgeVariant?: string
  searchIcon?: string
  searchIconVariant?: string
  clearIcon?: string
  clearIconVariant?: string
  loadingIcon?: string
  loadingIconVariant?: string
}

const props = withDefaults(defineProps<Props>(), {
  valueField: 'id',
  textField: 'name',
  disabled: false,
  debounce: 400,
  perPage: 30,
  noBadge: false,
  noDetails: false,
  required: false,
  filterName: 'keyword',
  searchIcon: 'magnifying-glass',
  searchIconVariant: 'muted',
  clearIconVariant: 'muted',
  loadingIcon: 'circle-notch',
  loadingIconVariant: 'muted',
  noBadgeVariant: 'secondary'
})

interface Emits {
  (e: 'update:modelValue', val: any): void
  (e: 'initialize', val: any): void
  (e: 'change', val: any): void
  (e: 'select', val: any): void
  (e: 'clear', val: any): void
  (e: 'input', val: any): void
  (e: 'remove', val: any): void
}

const emit = defineEmits<Emits>()

const progressing = ref<boolean>(false)
const page = ref<number>(1)
const text = ref<string>('')
const isVisible = ref<boolean>(false)
const selected = ref<IObject[]>([])
const timer = ref<number>(0)
const results = ref<object[]>([])
const keyword = ref<string>('')
const keywordSearch = ref<string>('')
const modalSelectedItems = ref<IObject[]>([])
const resultClasses = ref<string[]>([props.resultClass, 'cursor-pointer list-group-item-action'])

onMounted(() => {
  setSelected()
})

const modelField = computed(() => {
  return props.modelField ? props.modelField : props.valueField
})

const getText = (item: IObject): string | null => {
  if (!item) return null
  const label = (typeof props.textField === 'string' && props.textField) || 'name'
  return item[label]
}

const getValue = (item: IObject) => {
  if (!item) return null
  if (!props.valueField) return item
  return typeof props.valueField === 'string' && item[props.valueField]
}

const getModel = (item: IObject) => {
  if (!item) return null
  if (!modelField.value) return item
  if (typeof modelField.value === 'string') return item[modelField.value]
  if (typeof modelField.value === 'function') return modelField.value(item)
}

const showModal = () => {
  isVisible.value = true
}

const hideModal = () => {
  isVisible.value = false
  page.value = 1
  setTimeout(() => {
    modalSelectedItems.value = [...selected.value]
    progressing.value = true
    keywordSearch.value = ''
  }, 400)
}

const updateModalSelected = (items: object[]): void => {
  items = items || []
  modalSelectedItems.value = items
}

const updateSelected = (items: object[]): void => {
  items = items || []
  selected.value = items
  emitInput(items)
  emitChange(items)
}

const remove = (item: IObject) => {
  emitRemove(item)
  const items = selected.value.filter((i) => getValue(i) !== getValue(item))
  updateSelected(items)
  updateModalSelected(items)
}

const searchKeyword = (keyword: string) => {
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    getResults(keyword)
  }, props.debounce)
}

const isSelected = (item: object) => {
  return modalSelectedItems.value.find((i) => getValue(i) === getValue(item))
}

const add = (item: IObject): void => {
  if (!isSelected(item)) {
    emitSelect(item)
    modalSelectedItems.value.push(item)
  } else modalSelectedItems.value = modalSelectedItems.value.filter((i) => getValue(i) !== getValue(item))
}

const getResults = async (keyword: string) => {
  try {
    const filters = setFilter(keyword)
    if (props.search && typeof props.search === 'function') {
      const items: object[] = await props.search(filters)
      results.value = items

      progressing.value = false
    }
  } catch (err: any) {
    useErrors(err)
  }
}

const setFilter = (keyword: string): object => {
  let filter: IObject = {
    size: props.perPage,
    page: page.value
  }

  if (keyword && typeof keyword === 'string') filter[props.filterName] = keyword

  if (props.extendFilter && typeof props.extendFilter === 'object') filter = { ...filter, ...props.extendFilter }

  return filter
}

const setSelected = async () => {
  if (!props.select && typeof props.select !== 'function') return

  try {
    const response = await props.select(props.modelValue)
    emitInitialize(response)
    updateModalSelected(response || [])
    updateSelected(response || [])
  } catch (err: any) {
    useErrors(err)
  }
}

const emitRemove = (item: object) => {
  emit('remove', item)
}

const emitInput = (val: object[]): void => {
  const items = val.map((item) => getModel(item))
  emit('input', items)
  emit('update:modelValue', items)
}

const emitChange = (val: object[]): void => {
  emit('change', val)
}

const emitInitialize = (items: object[]): void => {
  emit('initialize', items)
}

const emitSelect = (item: object): void => {
  emit('select', item)
}

const submit = () => {
  selected.value = [...modalSelectedItems.value]
  emitInput(selected.value)
  emitChange(selected.value)
  hideModal()
}
</script>

<template>
  <RInputGroup
    class="auto-complete-multi"
    :size="props.size"
    :prepend="props.prepend"
    :class="{ required: props.required }"
  >
    <RInputGroupPrepend v-if="$slots.prepend" is-text>
      <slot v-if="$slots.prepend" name="prepend" />
    </RInputGroupPrepend>

    <div class="wrapper" @click="showModal">
      <div v-for="item in selected" :key="getValue(item)" class="selected-item">
        <slot name="selected-item" :item="item" :items="selected">
          <slot name="selected-item-text" :getText="getText" :item="item">
            {{ getText(item) }}
          </slot>

          <font-awesome-icon
            size="sm"
            icon="xmark"
            class="align-middle cursor-pointer text-muted me-2"
            @click.stop="remove(item)"
          />
        </slot>
      </div>

      <div class="col align-self-stretch">
        <RFormInput
          v-model="text"
          readonly
          :dir="props.dir"
          :size="props.size"
          :disabled="props.disabled"
          :placeholder="placeholder"
        />
      </div>
    </div>

    <RInputGroupAppend v-if="$slots.append" is-text>
      <slot name="append" />
    </RInputGroupAppend>
  </RInputGroup>

  <RModal
    v-model="isVisible"
    scrollable
    centered
    header-class="p-2"
    footer-class="p-2 d-flex align-items-center justify-content-start"
    header-bg-variant="light"
    footer-bg-variant="light"
    :body-class="['px-0', progressing ? 'py-2' : 'pb-1 pt-0']"
    @hide="hideModal"
    @shown="getResults"
  >
    <template #modal-header>
      <div class="flex-grow-1 position-relative">
        <RFormInput
          v-model="keywordSearch"
          v-r-focus
          size="sm"
          class="auto-complete"
          :dir="props.dir"
          :debounce="props.debounce"
          :placeholder="$t('shared.search')"
          @input="searchKeyword($event.target.value)"
        />

        <div class="h-100 d-flex align-items-center vertical-center">
          <font-awesome-icon
            :icon="props.searchIcon"
            class="cursor-pointer"
            :class="`text-${props.searchIconVariant}`"
            @click="searchKeyword(keyword)"
          />
        </div>
      </div>
    </template>

    <RListGroup id="options" flush class="px-0 rounded">
      <RListGroupItem v-if="progressing" class="border-0 text-center">
        <font-awesome-icon spin :icon="props.loadingIcon" size="4x" :class="`text-${props.loadingIconVariant}`" />
      </RListGroupItem>

      <template v-else-if="results && results.length">
        <RListGroupItem
          v-for="(item, index) in results"
          :key="getValue(item)"
          :class="[{ active: isSelected(item) }, resultClasses]"
          @click="add(item)"
        >
          <slot name="item" :item="item">
            <div :id="`item-${index}`" class="row">
              <div v-if="getText(item)" :id="`item-text-${index}`" class="flex-grow-1 col-auto small">
                <slot name="item-text" :item="item">
                  {{ getText(item) }}
                </slot>
              </div>

              <div v-if="!props.noBadge && getValue(item)" class="col-auto">
                <RBadge :id="`item-badge-${index}`" class="pt-1 mx-1" :variant="props.noBadgeVariant">
                  {{ getValue(item) }}
                </RBadge>
              </div>
            </div>
          </slot>
        </RListGroupItem>
      </template>

      <RListGroupItem v-else class="text-muted cursor-pointer text-center">
        {{ $t('shared.noRecords') }}
      </RListGroupItem>
    </RListGroup>

    <template #modal-footer>
      <RButton variant="success" size="sm" class="px-4" :disabled="!modalSelectedItems?.length" @click="submit">
        {{ $t('shared.save') }}
      </RButton>
    </template>
  </RModal>
</template>
