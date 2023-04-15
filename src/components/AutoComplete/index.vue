<script lang="ts" setup>
import { computed, onMounted, ref, watch, type HTMLAttributes } from 'vue'
import type { IObject } from '../../utils/object'
import $t from '@/composables/useTranslations'
import {
  RBadge,
  RModal,
  RListGroup,
  RFormInput,
  RInputGroup,
  RListGroupItem,
  RInputGroupAppend,
  RInputGroupPrepend,
  vRFocus
} from '@routaa/ui-kit'

type Props = {
  modelValue: string | number | null
  prepend?: string
  dir?: string
  valueField?: string | Function | boolean
  textField?: string | Function
  altTextField?: string | Function
  modelField?: string | Function | boolean
  disabled?: boolean
  extendFilter?: object
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  debounce?: number
  perPage?: number
  select?: Function
  search?: Function
  noBadge?: boolean
  noDetails?: boolean
  filterName?: string
  required?: boolean
  resultClass?: HTMLAttributes['class']
  noBadgeVariant?: string
  searchIcon?: string
  searchIconVariant?: string
  clearIcon?: string
  clearIconVariant?: string
  loadingIcon?: string
  loadingIconVariant?: string
  name?: string
}

type Error = {
  data?: string
  errorCode?: number
  status?: number
  code?: number
}

const props = withDefaults(defineProps<Props>(), {
  valueField: 'id',
  textField: 'name',
  altTextField: 'altText',
  extendFilter: () => ({}),
  size: 'md',
  debounce: 400,
  perPage: 30,
  noBadge: false,
  noDetails: false,
  filterName: 'keyword',
  required: false,
  dir: 'auto',
  noBadgeVariant: 'secondary',
  searchIcon: 'magnifying-glass',
  searchIconVariant: 'muted',
  clearIcon: 'xmark',
  clearIconVariant: 'muted',
  loadingIcon: 'circle-notch',
  loadingIconVariant: 'muted'
})

interface Emits {
  (e: 'update:modelValue', val: any): void
  (e: 'initialize', val: any): void
  (e: 'change', val: any): void
  (e: 'select', val: any): void
  (e: 'clear', val: any): void
  (e: 'input', val: any): void
}

const emit = defineEmits<Emits>()

const progressing = ref<boolean>(true)
const keywordSearch = ref<string>('')
const page = ref<number>(1)
const timer = ref<number>(0)
const isVisible = ref(false)
const results = ref<object[]>([])
const text = ref<string>('')
const changeKeyword = ref<boolean>(false)
const resultClasses = ref([props.resultClass, 'cursor-pointer list-group-item-action'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
    if (val) emitChange(val)
  }
})

const placeholder = computed<string>(() => {
  return !!props.placeholder ? props.placeholder : $t('shared.clickToSelect')
})

const modelField = computed(() => {
  return props.modelField ? props.modelField : props.valueField
})

onMounted(() => {
  if (props.select) setSelected()
  else if (model.value) getResults()
})

watch(
  () => keywordSearch.value,
  () => (changeKeyword.value = true)
)

const getText = (item: IObject): string | null => {
  if (!item) return null
  const label = (typeof props.textField === 'string' && props.textField) || 'name'
  return item[label]
}

const getAltText = (item: IObject): string | null => {
  if (!item) return null
  const label = (typeof props.altTextField === 'string' && props.altTextField) || 'altText'
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
    progressing.value = true
    keywordSearch.value = ''
  }, 400)
}

const updateValue = (item: object | null) => {
  const value = (item && typeof item === 'object' && getModel(item)) || null
  text.value = (item && typeof item === 'object' && getText(item)) || ''
  emit('input', value)
  model.value = value
}

const choose = (item: object) => {
  if (item && typeof item === 'object') update(item)

  hideModal()
}

const update = (item: object) => {
  emitSelect(item)
  updateValue(item)
}

const clear = () => {
  if (!props.disabled) {
    updateValue(null)
    emitClear()
  }
}

const searchKeyword = (keyword: string) => {
  if (!keyword && typeof keyword !== 'string') return

  progressing.value = true
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    getResults(keyword)
  }, props.debounce)
}

const isSelect = (item: IObject) => {
  if (item && typeof item === 'object')
    return typeof props.valueField === 'string' && model.value === item[props.valueField]
  else return false
}

const setSelected = async () => {
  if (!props.select && typeof props.select !== 'function') return updateValue(null)

  try {
    const item = await props.select()

    emitInitialize(item)
    updateValue(item || null)
  } catch (err) {
    if (typeof err === 'object') errorHandler(err)
    updateValue(null)
  }
}

const getResults = async (keyword: string = keywordSearch.value) => {
  const filter = setFilter(keyword)

  try {
    if (props.search && typeof props.search === 'function') {
      const items = await props.search(filter)
      if (items && items.length) {
        results.value = items

        if (model.value && !keyword && !changeKeyword.value) updateValue(items[0])
      } else results.value = []
    }

    progressing.value = false
  } catch (err) {
    results.value = []
    if (typeof err === 'object') errorHandler(err)
  }
}

const setFilter = (keyword: string): object => {
  let filter: IObject = {
    size: props.perPage,
    page: page.value
  }

  if (model.value && !keyword && !changeKeyword.value) filter[props.filterName] = model.value
  if (props.filterName && typeof props.filterName === 'string' && keyword && typeof keyword === 'string')
    filter[props.filterName] = keyword

  if (props.extendFilter && typeof props.extendFilter === 'object') filter = { ...filter, ...props.extendFilter }

  return filter
}

const errorHandler = (errors: Error | Error[] | null) => {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      if (typeof error === 'object') throwError(error)
    })
  } else throwError(errors)
}

const throwError = (error: Error | null): void => {
  if (error && error.data) throw new Error(error.data)
}

const emitInitialize = (item: object[]): void => {
  emit('initialize', item)
}

const emitSelect = (item: object): void => {
  emit('select', item)
}

const emitClear = (): void => {
  emit('clear', null)
}

const emitChange = (item: string | number): void => {
  emit('change', item)
}
</script>

<template>
  <RInputGroup :prepend="props.prepend" :size="props.size" :class="props.required ? 'required' : ''">
    <RInputGroupPrepend v-if="$slots.prepend" is-text>
      <slot v-if="$slots.prepend" />
    </RInputGroupPrepend>

    <div class="flex-grow-1">
      <RFormInput
        v-model="text"
        readonly
        class="auto-complete"
        :name="props.name"
        :dir="props.dir"
        :size="props.size"
        :disabled="props.disabled"
        :placeholder="placeholder"
        @click="showModal"
      />

      <div v-if="model" class="h-100 d-flex align-items-center vertical-center">
        <font-awesome-icon
          :icon="props.clearIcon"
          class="cursor-pointer"
          :class="[props.size === 'sm' ? null : `fa-${props.size}`, `text-${props.clearIconVariant}`]"
          @click="clear"
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
    hide-footer
    header-class="p-2"
    header-bg-variant="light"
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
            @click="searchKeyword(keywordSearch)"
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
          :class="[{ active: isSelect(item) }, resultClasses]"
          @click="choose(item)"
        >
          <slot name="item" :item="item">
            <div :id="`item-${index}`" class="row">
              <div v-if="getText(item)" :id="`item-text-${index}`" class="flex-grow-1 col-auto small">
                <slot name="item-text" :item="item">
                  {{ getText(item) }}

                  <slot v-if="getAltText(item) && !props.noDetails" name="details" :item="item">
                    <span class="text-muted small"> ({{ getAltText(item) }}) </span>
                  </slot>
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
  </RModal>
</template>
