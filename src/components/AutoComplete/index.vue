<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { IObject } from '../../utils/object'
import {
  RInputGroup,
  RFormInput,
  RModal,
  RListGroup,
  RListGroupItem,
  RBadge,
  RInputGroupAppend,
  RInputGroupPrepend,
  vRFocus
} from '@routaa/ui-kit'

type Props = {
  modelValue: string | number
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
  default?: boolean
  noBadge?: boolean
  noDetails?: boolean
  top?: boolean
  filterName?: string
  required?: boolean
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
  top: false,
  filterName: 'keyword',
  required: false
})

const modelField = computed(() => {
  return props.modelField ? props.modelField : props.valueField
})

const progressing = ref<boolean>(false)
const keywordSearch = ref<string>('')
const isExpandable = ref<boolean>(false)
const page = ref<number>(1)
const timer = ref<number>(0)
const isVisible = ref(false)
const results = ref<object[]>([])
const text = ref<string>('')
const element = ref(null)

interface Emits {
  (e: 'update:modelValue', val: any): void
  (e: 'initialize', val: any): void
  (e: 'change', val: any): void
  (e: 'select', val: any): void
  (e: 'clear', val: any): void
  (e: 'input', val: any): void
}

const emit = defineEmits<Emits>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

onMounted(() => {
  if (props.select) setSelected()
  else if (model.value) getResults()
})

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
  focus()
}

const updateValue = (item: object | null) => {
  const value = (item && typeof item === 'object' && getValue(item)) || null
  text.value = (item && typeof item === 'object' && getText(item)) || ''
  emit('input', value)
  model.value = value
}

const choose = (item: object) => {
  if (item && typeof item === 'object') update(item)
}

const update = (item: object) => {
  emitSelect(item)
  updateValue(item)
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
  if (item && typeof item === 'object') {
    return typeof props.valueField === 'string' && model.value === item[props.valueField]
  } else return false
}

const expandResult = () => {
  if (isExpandable.value) {
    progressing.value = true
    page.value++
    getResults(keywordSearch.value, page.value, true)
  }
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

const getResults = async (keyword: string = keywordSearch.value, currentPage: number = 1, expand: boolean = false) => {
  const filter = setFilter(keyword, currentPage)

  try {
    if (props.search && typeof props.search === 'function') {
      const items = await props.search(filter)

      if (items && items.length) {
        isExpandable.value = items.length > props.perPage
        if (expand) results.value.push(...items)
        else results.value = items

        if (model.value && !keyword) updateValue(items[0])
      }
    }

    progressing.value = false
  } catch (err) {
    if (typeof err === 'object') errorHandler(err)
  }
}

const setFilter = (keyword: string, currentPage: number): object => {
  let filter: IObject = {
    size: props.perPage
  }

  if (model.value && !keyword) filter[props.filterName] = model.value
  if (props.filterName && typeof props.filterName === 'string' && typeof keyword === 'string')
    filter[props.filterName] = keyword

  filter.page = currentPage && typeof currentPage === 'number' && currentPage > 1 ? currentPage : page.value

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

const throwError = (error: Error | null) => {
  if (error && error.data) throw new Error(error.data)
}

const emitInitialize = (item: object[]) => {
  emit('initialize', item)
}

const emitSelect = (item: object) => {
  emit('select', item)
}
</script>

<template>
  <RInputGroup :prepend="props.prepend" :size="props.size" :class="required ? 'required' : ''">
    <RInputGroupPrepend v-if="$slots.prepend">
      <slot v-if="$slots.prepend" />
    </RInputGroupPrepend>

    <div class="flex-grow-1">
      <RFormInput
        v-model="text"
        readonly
        class="auto-complete"
        :dir="props.dir"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        @click="showModal"
      />

      <div class="h-100 d-flex align-items-center vertical-center">
        <font-awesome-icon
          v-if="model"
          icon="xmark"
          class="me-2 text-moremuted cursor-pointer"
          :size="props.size == 'sm' ? null : props.size"
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
    content-class="p-2"
    header-class="border-0 px-4"
    @shown="getResults"
  >
    <template #modal-header>
      <RFormInput
        v-model="keywordSearch"
        v-r-focus
        :dir="props.dir"
        :placeholder="$t('shared.search')"
        @input="searchKeyword($event.target.value)"
      />
    </template>

    <RListGroup id="options" class="list-group-flush px-3">
      <RListGroupItem v-if="progressing"> {{ $t('shared.searching') }} ... </RListGroupItem>

      <template v-else-if="results && results.length">
        <RListGroupItem
          v-for="(item, index) in results"
          :key="getValue(item)"
          class="py-2 px-2 cursor-pointer auto-complete-list"
          action
          :class="isSelect(item) ? 'bg-light-success' : ''"
          @click="choose(item)"
        >
          <slot name="item" :item="item">
            <div :id="`item-${index}`" class="row">
              <div v-if="getText(item)" :id="`item-text-${index}`" class="flex-grow-1 col-auto">
                <slot name="item-text" :item="item">
                  {{ getText(item) }}

                  <slot v-if="getAltText(item) && !props.noDetails" name="details" :item="item">
                    <span class="text-muted small"> ({{ getAltText(item) }}) </span>
                  </slot>
                </slot>
              </div>

              <div v-if="!props.noBadge && getValue(item)" class="col-auto">
                <RBadge :id="`item-badge-${index}`" class="pt-1 mx-1" variant="secondary">
                  {{ getValue(item) }}
                </RBadge>
              </div>
            </div>
          </slot>
        </RListGroupItem>

        <RListGroupItem
          v-if="isExpandable"
          variant="success"
          action
          class="py-1 px-2 text-center cursor-pointer"
          @click="expandResult"
        >
          {{ $t('shared.moreResult') }}
        </RListGroupItem>
      </template>

      <RListGroupItem v-else class="py-1 px-2 text-muted cursor-pointer">
        {{ $t('shared.noRecords') }}
      </RListGroupItem>
    </RListGroup>
  </RModal>
</template>
