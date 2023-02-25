<template>
  <span>
    <span v-if="props.label" class="d-inline-block" :class="props.labelClass">
      {{ props.label }}
    </span>

    <span v-if="props.modelValue && props.relative" id="relative-time">
      <font-awesome-icon
        v-if="props.icon"
        icon="calendar-days"
        :size="props.iconSize"
        class="me-1"
        :class="props.iconClass"
      />
      {{ relativeTime }}
    </span>

    <span v-else-if="props.modelValue && props.humanize" id="humanized-time">
      <font-awesome-icon
        v-if="props.icon"
        icon="calendar-days"
        :size="props.iconSize"
        class="me-1"
        :class="props.iconClass"
      />
      {{ humanizedTime }}
    </span>

    <span v-else-if="props.modelValue" id="date">
      <template v-if="isFinity">
        <span v-if="props.time && props.firstIsDate" class="me-2">
          <font-awesome-icon
            v-if="props.icon"
            icon="clock"
            :size="props.iconSize"
            class="me-1"
            :class="props.iconClass"
          />

          <span v-if="props.seconds" id="time-vs">
            {{ timeVS }}
          </span>

          <span v-else id="time-v">
            {{ timeV }}
          </span>
        </span>

        <template v-if="props.date">
          <font-awesome-icon
            v-if="props.icon"
            icon="calendar-days"
            :size="props.iconSize"
            class="me-1"
            :class="props.iconClass"
          />

          <span id="get-day" v-if="props.dayName" class="me-2"> {{ getDayName }} </span>

          {{ dateV }}
        </template>

        <span v-if="props.time && !props.firstIsDate" class="ms-2">
          <font-awesome-icon
            v-if="props.icon"
            icon="clock"
            :size="props.iconSize"
            class="me-1"
            :class="props.iconClass"
          />

          <span v-else> {{ t('shared.clock') }} </span>

          <span v-if="props.seconds" id="time-vs">
            {{ timeVS }}
          </span>

          <span v-else id="time-v">
            {{ timeV }}
          </span>
        </span>
      </template>

      <font-awesome-icon v-else icon="infinity" id="icon-infinity" class="align-middle text-muted" />
    </span>
  </span>
</template>

<script setup lang="ts">
import momentTimezone from 'moment-timezone'
import useGlobalProps from '../../composable/useGlobalProps'
import momentJalaali from 'moment-jalaali'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const globalProps = useGlobalProps()

const { t } = useI18n()

type Props = {
  modelValue?: string | number
  label?: string
  labelClass?: [] | object | string
  relative?: boolean
  firstIsDate?: boolean
  humanize?: boolean
  dayName?: boolean
  seconds?: boolean
  date?: boolean
  time?: boolean
  icon?: boolean
  dateFormat?: string
  timeFormat?: string
  timeFormatSecond?: string
  iconClass?: string
  iconSize?: string
  mode?: string
}

const props = withDefaults(defineProps<Props>(), {
  relative: false,
  firstIsDate: false,
  humanize: false,
  dayName: false,
  seconds: false,
  date: true,
  time: false,
  icon: false,
  dateFormat: 'YYYY/M/D',
  timeFormat: 'HH:mm',
  timeFormatSecond: 'HH:mm:ss',
  iconClass: 'text-info',
  mode: 'date'
})

const isFinity = computed(() => {
  return props.modelValue !== '2999-01-01T00:00:00'
})

const dateFormatV = computed(() => {
  if (globalProps.$locale === 'fa') {
    return props.dateFormat.replace(/Y+|M+|D+/g, (m) => `j${m}`)
  } else {
    return props.dateFormat
  }
})

const moment = computed<string | null>(() => {
  if (!props.modelValue) return null
  if (props.mode === 'epoch') return momentJalaali(Number(props.modelValue))
  else return momentJalaali.utc(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSS')
})

const dateV = computed(() => {
  if (props.modelValue) {
    return moment.value.format(dateFormatV.value)
  }
})

const getDayName = computed(() => {
  if (props.modelValue) {
    return moment.value.format('dddd')
  } else {
    return null
  }
})

const timeV = computed(() => {
  if (props.modelValue) {
    return moment.value.format(props.timeFormat)
  }
})

const timeVS = computed(() => {
  if (props.modelValue) {
    return moment.value.format(props.timeFormatSecond)
  }
})

const relativeTime = computed(() => {
  return moment.value.fromNow()
})

const humanizedTime = computed(() => {
  if (props.time) {
    return moment.value.calendar()
  } else {
    return moment.value.calendar(null, {
      sameDay: t('forms.today'),
      nextDay: t('forms.tomorrow'),
      nextWeek: 'dddd',
      lastDay: t('forms.yesterday'),
      lastWeek: t('forms.lastWeekDay'),
      sameElse: dateFormatV.value
    })
  }
})
</script>
