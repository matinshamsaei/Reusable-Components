<script lang="ts" setup>
import { ref, type HTMLAttributes, computed } from 'vue'
import { RLink, RModal } from '@routaa/ui-kit'
import { mobileNormalizer } from '@/utils/shared'

type User = {
  id: number
  fullName: string
  firstName?: string
  lastName?: string
  email?: string
  mobile: string
}

type Props = {
  user: User
  label?: string
  labelClass?: HTMLAttributes['class']
  nameClass?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const show = ref(false)

const mobile = computed(() => {
  return mobileNormalizer(props.user.mobile)
})

const showModal = () => {
  show.value = true
}

const normalizerFullName = (fullName: string) => {
  if (fullName.startsWith('+98')) return mobileNormalizer(fullName)

  return fullName
}
</script>

<template>
  <span v-if="props.label" :class="props.labelClass">{{ props.label }} :</span>

  <RLink :class="props.nameClass" @click="showModal">
    <span v-if="props.user.fullName">
      {{ normalizerFullName(props.user.fullName) }}
    </span>

    <span v-else>
      {{ `${props.user.firstName} ${props.user.lastName}` }}
    </span>

    <span dir="ltr" class="text-muted"> ({{ props.user.id }}) </span>
  </RLink>

  <RModal v-model="show" centered no-fade hide-footer body-class="pb-2" title="ee">
    <template #modal-title>
      <span v-if="props.user.fullName"> {{ normalizerFullName(props.user.fullName) }} ({{ props.user.id }}) </span>

      <span v-else> {{ props.user.firstName }} {{ props.user.lastName }} ({{ props.user.id }}) </span>
    </template>

    <div class="row">
      <div class="col-md-6 mb-2">{{ $t('shared.email') }} : {{ user.email || '- - -' }}</div>

      <div class="col-md-6 mb-2">{{ $t('shared.mobile') }} : {{ mobile || '- - -' }}</div>
    </div>
  </RModal>
</template>
