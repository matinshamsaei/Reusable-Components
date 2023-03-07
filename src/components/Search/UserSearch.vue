<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { IObject } from '@/utils/object'
import { mobileNormalizer } from '@/utils/shared'
import useTranslations from '@/composable/useTranslations'
import { RInputGroup, RFormInput, RInputGroupAppend, RButton, RTable } from '@routaa/ui-kit'
import CModal from '@/components/CModal/index.vue'
import NumericInput from '@/components/NumericInput/index.vue'

type Props = {
  size?: string
  prepend?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm'
})

const titleHandler = computed(() => (props.title ? props.title : props.prepend))

const open = ref<boolean>(false)

function show(): void {
  open.value = true
}

function hide(): void {
  open.value = false
  reset()
}

const search = reactive<IObject>({
  id: '',
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  nationalId: ''
})

const progressing = ref<boolean>(false)

function reset(): void {
  search.id = ''
  search.firstName = ''
  search.lastName = ''
  search.mobile = ''
  search.email = ''
  search.nationalId = ''
  items.value = []
}

async function searching(filter: IObject) {
  items.value = []
  if (filter.id === null) filter.id = ''
  items.value.push(...(await getApi(filter)))
}

function getApi(filter: IObject): Promise<IObject[]> {
  // return props.getAllInfoApi(filter)
  return fetch(
    `http://192.168.7.16/user-mgmt/api/admin/users/info?id=${filter.id}&page=1&size=20&sort%5B0%5D.column=id&sort%5B0%5D.type=DESCENDING`,
    {
      headers: {
        Accept: 'application/json, text/plain, */*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACWOTQ7CIBCF7zLrYpiCwLDzDl4A6JigUUynTYzGuwtx9ZLv_eR9YK8LRHs0E8ieIcKpFBY5txs_YIIq0llp90PmtbX3ypLSMPj1hIjOByTjZ9uTafsDPWsa4LrVXsUUdHA6q4wBlc35omgOiyJKyOS4K_c5GS-CN_r7A3O9vmKSAAAA.C30GYqxa4hACccofpUEeausfTViWCt2XA2ir9RUE-tYX8CsUtU1xLoX1-ucAxPt9dqDIqOogGePU8tptjfU5Dw'
      }
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data
    })
}

const fields = ref<Array<IObject>>([
  {
    key: 'id',
    label: useTranslations('shared.id'),
    thStyle: 'width: 100px'
  },
  {
    key: 'firstName',
    label: useTranslations('shared.name')
  },
  {
    key: 'lastName',
    label: useTranslations('shared.lastName'),
    thStyle: 'width: 100px'
  },
  {
    key: 'mobile',
    label: useTranslations('shared.mobile')
  },
  {
    key: 'nationalId',
    label: useTranslations('shared.nationalId')
  },
  {
    key: 'actions',
    label: '',
    thStyle: 'width: 150px'
  }
])

const items = ref<Array<IObject>>([])

const selectedItems = ref<Array<IObject>>([])

function toggleItem(item: IObject): void {
  selectedItems.value = []
  selectedItems.value.push(item)
  hide()
}

function createUserName(userObj: IObject): string {
  return `${userObj.firstName} ${userObj.lastName}`
}

const input = ref()

function removeUsers(): void {
  input.value[0].textContent = ''
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

        <RInputGroupAppend v-if="selectedItems.length" isText class="cursor-pointer" @click="removeUsers">
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
        <RInputGroup :prepend="useTranslations('shared.firstName')">
          <RFormInput v-model="search.firstName" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="useTranslations('shared.lastName')">
          <RFormInput v-model="search.lastName" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="useTranslations('shared.mobile')">
          <RFormInput v-model="search.mobile" :name="$t('shared.mobile')" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="useTranslations('shared.email')">
          <RFormInput v-model="search.email" :name="useTranslations('shared.email')" />
        </RInputGroup>
      </div>

      <div class="col-lg-4 mb-3">
        <RInputGroup :prepend="useTranslations('shared.nationalId')">
          <NumericInput no-separator v-model="search.nationalId" :name="useTranslations('shared.nationalId')" />
        </RInputGroup>
      </div>
    </div>

    <div class="d-flex">
      <RButton :disabled="progressing" @click="hide">
        {{ useTranslations('shared.close') }}
      </RButton>

      <RButton :disabled="progressing" class="ms-auto" @click="reset">
        {{ useTranslations('shared.removeFilter') }}
      </RButton>

      <RButton variant="success" :disabled="progressing" class="ms-2" @click="searching(search)">
        <font-awesome-icon
          :icon="progressing ? 'gear' : 'magnifying-glass'"
          size="sm"
          :spin="progressing"
          class="me-1 align-middle"
        />
        {{ useTranslations('shared.search') }}
      </RButton>
    </div>

    <hr />

    <RTable :fields="fields" :items="items" :empty-text="$t('shared.noRecords')">
      <template #mobile="{ item }">
        {{ mobileNormalizer(item.mobile) }}
      </template>

      <template #actions="{ item }">
        <RButton class="px-3" size="sm" variant="success" @click="toggleItem(item)">
          {{ useTranslations('shared.select') }}
        </RButton>
      </template>
    </RTable>
  </CModal>
</template>
