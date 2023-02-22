<script setup lang="ts">
import PageTitle from '@/components/PageTitle/index.vue'
import RButton from '@/components/RButton/index.vue'
import RCollapse from '@/components/RCollapse/index.vue'
import { vRToggle } from '@routaa/ui-kit'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

type Props = {
  search?: boolean
  img?: string
  icon?: string
  progressing?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  search: true,
  icon: ' user-gear',
  title: t('shared.search')
})
</script>

<template>
  <div>
    <div class="row d-flex justify-content-between align-items-center mb-4 pt-1">
      <div class="col-12 col-sm-6">
        <PageTitle :title="props.title" :icon="props.icon" :simple="false" :noTopSpace="false" />
      </div>

      <div class="d-flex justify-content-end col-12 col-sm-6">
        <slot name="actions-left"></slot>

        <RButton
          v-if="props.search"
          size="md"
          v-r-toggle="'filter-body'"
          variant="outline-light-dark"
          class="text-nowrap px-4 ms-3"
        >
          <font-awesome-icon icon="filter" size="sm" class="align-middle me-1" />
          {{ t('shared.filter') }}
        </RButton>
      </div>
    </div>

    <RCollapse id="filter-body">
      <div class="card search-box">
        <div class="card-body py-2">
          <div class="row d-flex justify-content-between">
            <div class="col">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </RCollapse>
  </div>
</template>
