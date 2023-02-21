<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RImg, RButton } from '@routaa/ui-kit'

const { t } = useI18n()

function metaInfo() {
  return {
    title: t('shared.pageNotFound')
  }
}
</script>

<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <h4 class="pb-4 text-dark font-weight-bold" dir="rtl">{{ $t('shared.pageNotFound') }}</h4>
          </div>

          <RImg class="d-block mx-auto mb-5" src="/img/404.png" alt="404" fluid-grow />

          <div class="d-flex flex-column justify-content-center align-items-center">
            <RButton to="/" class="px-6" variant="primary">
              {{ $t('shared.backToHome') }}
            </RButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
