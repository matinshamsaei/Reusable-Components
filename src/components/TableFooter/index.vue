<script setup lang="ts">
import { RFormSelect, RPagination } from '@routaa/ui-kit'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sizeOptions = ref([10, 20, 50, 100])

const emit = defineEmits<Emits>()

interface Emits {
  (e: 'update:currentPage', value: any): void
  (e: 'update:perPage', value: any): void
}

type Props = {
  total: number | string
  perPage: number | string
  currentPage: number | string
  showTotal?: boolean
  showPerPage?: boolean
  card?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTotal: true,
  showPerPage: true,
  card: true
})

const perPage = +props.perPage
const currentPage = +props.currentPage

const page = computed({
  get() {
    return props.currentPage
  },
  set(value: string | number) {
    if (checkPagination(perPage)) value = 1
    emit('update:currentPage', value)
  }
})

const size = computed({
  get() {
    return props.perPage
  },
  set(val: string | number) {
    if (checkPagination(+val)) page.value = 1
    emit('update:perPage', val)
  }
})

const isLastPage = computed(() => {
  if (typeof props.total === 'number') return perPage * currentPage >= props.total
})

const from = computed(() => {
  return (currentPage - 1) * perPage + 1
})

const to = computed(() => {
  if (isLastPage) {
    return props.total
  }
  return perPage * currentPage
})

function checkPagination(perPage: number) {
  let to
  let from
  if (typeof props.total === 'number' && perPage * currentPage >= props.total) {
    to = props.total
  } else {
    to = perPage * currentPage
  }
  from = (currentPage - 1) * perPage + 1
  return from > to
}
</script>

<template>
  <div
    v-if="props.total"
    id="table-footer-card"
    class="d-flex d-print-none mt-2 mb-3 px-2 py-1"
    :class="card ? 'card' : 'justify-content-center'"
  >
    <div class="row d-flex justify-content-between">
      <div v-if="props.showTotal" class="col-sm col-12 d-flex align-items-center text-dark mb-3 ms-2 my-sm-1">
        <div class="mx-auto mx-sm-0">
          <h6 class="d-inline-block font-md mb-0" id="from-to">{{ from }} {{ t('shared.until') }} {{ to }}</h6>

          <span>
            {{ t('shared.from') }}
          </span>

          <h6 class="d-inline-block font-md mb-0">
            {{ props.total }}
          </h6>

          <span>
            {{ t('shared.item') }}
          </span>
        </div>
      </div>

      <div v-if="props.total > props.perPage" class="d-flex my-auto col-sm col-12">
        <RPagination
          v-model="page"
          :totalRows="props.total"
          :perPage="props.perPage"
          class="font-md mb-0 mx-auto px-0"
        />
      </div>

      <div v-if="props.showPerPage" class="d-flex me-1 my-2 col-sm col-12">
        <div class="d-flex align-items-center font-md mx-auto me-md-0 ms-md-auto">
          <div class="text-nowrap text-dark px-2">
            {{ t('shared.count') }}
          </div>

          <RFormSelect v-model="size" :options="sizeOptions" size="sm" class="text-dark transparent-input" />
        </div>
      </div>
    </div>
  </div>
</template>
