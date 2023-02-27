<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RTable, RButton, RInputGroup, RInputGroupText, RInputGroupAppend, RBadge } from '@routaa/ui-kit'
import CModal from '@/components/CModal/index.vue'
import { mobileNormalizer } from '@/utils/shared'
import type { IObject } from '../../utils/object'
import { isObject } from '@vue/shared'

type Props = {
  modelValue: Array<IObject>
  size?: string
  prepend?: string
  title?: string
  fields?: []
  valueField?: string | Function | boolean
  textField?: string | Function
  select?: Function
  search?: Function
  disabled?: boolean
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  valueField: 'id',
  textField: 'name',
  disabled: false,
  multiple: false
})

const progressing = ref<boolean>(false)
const open = ref<boolean>(false)
const items = ref<[]>([])

type Emits = {
  (e: 'input', value: object | undefined): void
  (e: 'reset'): void
  (e: 'initialize', value: object): void
  (e: 'remove', value: object): void
  (e: 'clear', value: object): void
  (e: 'select', value: object | null): void
}

const emits = defineEmits<Emits>()

let selectedItems = computed<IObject[]>({
  get() {
    return props.modelValue
  },
  set(val: Array<IObject>) {
    emits('input', val)
  }
})

// onMounted(() => {
//   initialize()
// })

// function initialize() {
//   if (props.select) {
//     props.select().then((res: any) => {
//       emitInitialize(res)
//       if (!res) return
//       if (!props.multiple) {
//         res = [res]
//       }
//       selectedItems = res
//     })
//   }
// }

function show() {
  open.value = true
}

function hide() {
  open.value = false
}

function getText(item: IObject) {
  if (!item) return null
  if (!props.textField) return item.name
  if (typeof props.textField === 'string') return NormalizeText(item[props.textField])

  return NormalizeText(props.textField(item))
}

function NormalizeText(text: string) {
  if (text.startsWith('+98' || '09')) return mobileNormalizer(text)
  return text
}

function getValue(item: IObject) {
  if (!item) return null
  if (!props.valueField) return item.id
  if (typeof props.valueField === 'string') return item[props.valueField]
  if (typeof props.valueField === 'function') return props.valueField(item)
}

function getKey(item: object) {
  return getText(item) + `${getValue(item)}`
}

function reset() {
  items.value = []
  emits('reset')
}

// function emitInitialize(item: object) {
//   emits('initialize', item)
// }

function emitRemove(item: object) {
  emits('remove', item)
}
/*
function emitClear(item: object) {
  emits('clear', item)
}emits
*/
function emitSelect(item: object | null) {
  emits('select', item)
}

function isSelected(item: object) {
  return !!selectedItems.value?.find((i: any) => getValue(i) == getValue(item))
}

function toggleItem(item: object) {
  if (!item) return
  const isItemSelected = isSelected(item)

  if (props.multiple) {
    if (isItemSelected) {
      removeItem(item)
    } else {
      const items: IObject[] = [...(selectedItems.value as [])]
      items.push(item)
      selectedItems.value = items
      emitSelect(item)
    }
  } else {
    selectedItems.value = [item]
    emitSelect(item)
    hide()
  }
}

function removeItem(item: object) {
  selectedItems.value = selectedItems.value?.filter((i: any) => getValue(i) !== getValue(item))
  emitRemove(item)
  emitSelect(selectedItems)
}

function searching() {
  progressing.value = true
  if (props.search)
    props
      .search()
      .then((res: []) => {
        items.value = res
        return res
      })
      .catch((err: object) => {
        // $showError('advance-search : ' + $getLocaleErrorMessage(err))
        // selected = []
      })
      .finally(() => {
        progressing.value = false
      })
}

function clear() {
  // if ($isEmpty(selectedItems)) return
  selectedItems.value = []
  const val = props.multiple ? selectedItems.value : selectedItems.value[0]
  emits('clear', val)
  emitSelect(null)
}
</script>

<template>
  <CModal
    v-model="open"
    :title="title"
    :label="prepend"
    class="d-block"
    hide-footer
    size="xl"
    :disabled="disabled"
    :scrollable="!!items.length"
    @hidden="reset"
  >
    <template #activator="{ show, hide }">
      <slot name="activator" :show="show" :hide="hide">
        <RInputGroup :size="size" :prepend="prepend">
          <div
            @click="show"
            class="form-control h-auto d-flex flex-wrap cursor-pointer"
            :class="{ 'cursor-pointer': !multiple, 'bg-disabled': disabled }"
          >
            <component
              :is="multiple ? 'r-badge' : 'div'"
              v-for="item in selectedItems"
              :key="getKey(item)"
              variant="light"
              class="d-flex align-items-center justify-content-between font-weight-normal"
              :class="{ 'me-1 font-90': multiple }"
            >
              <slot name="selected-item-text" :item="item">
                {{ getText(item) }}
              </slot>

              <font-awesome-icon
                v-if="multiple && !disabled"
                @click.stop="removeItem(item)"
                icon="xmark"
                class="cursor-pointer text-secondary align-middle ms-1"
              />
            </component>
          </div>
          <RInputGroupAppend v-if="multiple && !disabled" isText @click="show" class="cursor-pointer">
            <RInputGroupText>
              <font-awesome-icon :size="size == 'sm' ? null : size" icon="plus" class="text-success" />
            </RInputGroupText>
          </RInputGroupAppend>

          <RInputGroupAppend
            v-else-if="props.modelValue && props.modelValue.length && !disabled"
            @click="clear()"
            class="cursor-pointer"
          >
            <RInputGroupText class="bg-white">
              <font-awesome-icon :size="size == 'sm' ? null : size" icon="xmark" class="text-muted" />
            </RInputGroupText>
          </RInputGroupAppend>
        </RInputGroup>
      </slot>
    </template>

    <!-- <errors-display /> -->

    <template #default="{ show, hide }">
      <slot :hide="hide" :show="show"></slot>

      <slot name="actions" :hide="hide" :show="show">
        <div class="d-flex align-items-center">
          <RButton @click.prevent="hide" class="me-auto" variant="secondary" :disabled="progressing">
            {{ $t('shared.close') }}
          </RButton>

          <RButton :disabled="progressing" class="me-2" variant="light-dark" @click.prevent="reset">
            {{ $t('shared.removefilter') }}
          </RButton>

          <RButton :disabled="progressing" variant="success" @click.prevent="searching">
            <font-awesome-icon
              :icon="progressing ? 'gear' : 'magnifying-glass'"
              size="sm"
              :spin="progressing"
              class="me-1 align-middle"
            />
            {{ $t('shared.search') }}
          </RButton>
        </div>
      </slot>

      <hr />

      <div v-if="multiple" class="d-flex align-items-start">
        <slot name="selecteds" :items="selectedItems" :removeItem="removeItem">
          <div style="min-height: 45px" class="flex-grow-1">
            <RBadge
              v-for="item in selectedItems"
              :key="getKey(item)"
              variant="light"
              class="py-2 me-2 d-inline-block font-90 font-weight-normal mb-3"
            >
              <slot name="selected-item-text" :item="item">
                {{ getText(item) }}
              </slot>

              <slot name="item-icon" :item="item" :removeItem="removeItem">
                <font-awesome-icon
                  @click="removeItem(item)"
                  icon="xmark"
                  class="mr-2 cursor-pointer text-secondary align-middle ms-1"
                />
              </slot>
            </RBadge>
          </div>
        </slot>

        <RButton v-if="selectedItems.length" variant="danger" @click="clear" class="ms-auto" size="sm">
          {{ $t('shared.removeAll') }}
        </RButton>
      </div>

      <RTable
        class="mb-0 bg-white"
        striped
        hover
        bordered
        :fields="fields"
        :items="items"
        :empty-text="$t('shared.noRecords')"
      >
        <!-- <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
          <slot :name="slot" v-bind="props" :show="show" :hide="hide" />
        </template> -->

        <template #cell(actions)="props">
          <slot name="cell(actions)" v-bind="{ ...props, show, hide }">
            <div class="text-center">
              <RButton
                class="px-3"
                size="sm"
                :variant="multiple && isSelected(props.item) ? 'danger' : 'success'"
                @click="toggleItem(props.item)"
              >
                {{ multiple && isSelected(props.item) ? $t('shared.remove') : $t('shared.select') }}
              </RButton>
            </div>
          </slot>
        </template>
      </RTable>
    </template>
  </CModal>
</template>
