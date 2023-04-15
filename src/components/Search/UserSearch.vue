<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { RInputGroup, RFormInput, RInputGroupAppend, RButton, RTable } from '@routaa/ui-kit'
import $t from '@/composables/useTranslations'
import type { IObject } from '@/utils/object'
import { mobileNormalizer } from '@/utils/shared'
import CModal from '@/components/CModal/index.vue'
import NumericInput from '@/components/NumericInput/index.vue'

type Props = {
  modelValue?: string | number
  size?: string
  prepend?: string
  title?: string
  getAllInfo: Function
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm'
})

const titleHandler = computed(() => (props.title ? props.title : props.prepend))

type Emits = {
  (e: 'update:modelValue', val: string | number): void
}

const emits = defineEmits<Emits>()

const search = reactive<IObject>({
  id: '',
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  nationalId: ''
})

const open = ref<boolean>(false)

function show(): void {
  open.value = true
}

function hide(): void {
  open.value = false
  reset()
}

function reset(): void {
  search.id = ''
  search.firstName = ''
  search.lastName = ''
  search.mobile = ''
  search.email = ''
  search.nationalId = ''
  items.value = []
}

const progressing = ref<boolean>(false)

async function searching(filter: IObject) {
  items.value = []
  if (filter.id === null) filter.id = ''
  items.value.push(...(await getApi(filter)))
}

function getApi(filter: IObject): Promise<IObject[]> {
  return props.getAllInfo(filter)
}

const fields = ref<Array<IObject>>([
  {
    key: 'id',
    label: $t('shared.id'),
    thStyle: 'width: 100px'
  },
  {
    key: 'firstName',
    label: $t('shared.name')
  },
  {
    key: 'lastName',
    label: $t('shared.lastName'),
    thStyle: 'width: 100px'
  },
  {
    key: 'mobile',
    label: $t('shared.mobile')
  },
  {
    key: 'nationalId',
    label: $t('shared.nationalId')
  },
  {
    key: 'actions',
    label: '',
    thStyle: 'width: 150px'
  }
])

const items = ref<Array<IObject>>([])

let selectedItems = reactive<IObject>({})

function selectItem(item: IObject): void {
  selectedItems = {}
  selectedItems = { ...item }
  emits('update:modelValue', selectedItems.id)
  hide()
}

function createUserName(userObj: IObject): string {
  return `${userObj.firstName} ${userObj.lastName}`
}

const input = ref()

function removeUsers(): void {
  input.value[0].textContent = ''
  selectedItems = {}
  emits('update:modelValue', selectedItems.id)
  reset()
}
</script>

<template>
  <CModal v-model="open" hide-footer size="xl" :title="titleHandler" @hidden="hide">
    <template #activator>
      <RInputGroup :size="props.size" :prepend="props.prepend" @click="show">
        <div class="form-control cursor-pointer">
          <div ref="input" v-if="selectedItems.length" v-for="item in selectedItems">{{ createUserName(item) }}</div>
        </div>

        <RInputGroupAppend v-if="selectedItems.length" isText class="cursor-pointer" @click.stop="removeUsers">
          <font-awesome-icon icon="xmark" size="sm" />
        </RInputGroupAppend>
      </RInputGroup>
    </template>

    <div class="row">
      <div class="col-4 mb-3">
        <RInputGroup prepend="ID">
          <NumericInput no-separator v-model="search.id" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="$t('shared.firstName')">
          <RFormInput v-model="search.firstName" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="$t('shared.lastName')">
          <RFormInput v-model="search.lastName" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="$t('shared.mobile')">
          <RFormInput v-model="search.mobile" :name="$t('shared.mobile')" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="$t('shared.email')">
          <RFormInput v-model="search.email" :name="$t('shared.email')" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="$t('shared.nationalId')">
          <NumericInput no-separator v-model="search.nationalId" :name="$t('shared.nationalId')" />
        </RInputGroup>
      </div>
    </div>

    <div class="d-flex">
      <RButton :disabled="progressing" @click="hide">
        {{ $t('shared.close') }}
      </RButton>

      <RButton :disabled="progressing" class="ms-auto" @click="reset">
        {{ $t('shared.removeFilter') }}
      </RButton>

      <RButton variant="success" :disabled="progressing" class="ms-2" @click="searching(search)">
        <font-awesome-icon
          :icon="progressing ? 'gear' : 'magnifying-glass'"
          size="sm"
          :spin="progressing"
          class="me-1 align-middle"
        />
        {{ $t('shared.search') }}
      </RButton>
    </div>

    <hr />

    <RTable :fields="fields" :items="items" :empty-text="$t('shared.noRecords')">
      <template #mobile="{ item }">
        {{ mobileNormalizer(item.mobile) }}
      </template>

      <template #actions="{ item }">
        <RButton class="px-3" size="sm" variant="success" @click="selectItem(item)">
          {{ $t('shared.select') }}
        </RButton>
      </template>
    </RTable>
  </CModal>
</template>
