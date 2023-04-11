<script setup lang="ts">
import { computed } from 'vue'
import $t from '@/composable/useTranslations'
import { RImg, RButton } from '@routaa/ui-kit'

type Props = {
  title?: string
  back?: Function
  code?: string
}

const props = defineProps<Props>()

const pageTitle = computed(() => {
  return props.title || $t('shared.oopsWeHaveAProblem')
})
</script>

<template>
  <div class="app flex-row align-items-center bg-white">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <div class="d-flex justify-content-center align-items-center flex-column mb-2">
            <h1 v-if="props.code" class="ms-4 h6">{{ props.code }}</h1>

            <h2 class="py-2 text-dark h4">{{ pageTitle }}</h2>

            <p class="text-dark">{{ $t('shared.tryAgain') }}</p>
          </div>

          <RImg class="d-block mx-auto mb-5" src="/img/500.png" alt="500" fluid-grow />

          <div class="d-flex justify-content-center align-items-center">
            <RButton v-if="props.back" @click="props.back" class="px-4" variant="primary">
              <font-awesome-icon icon="rotate-left" class="align-middle mx-1" />

              {{ $t('shared.loadAgain') }}
            </RButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
