<template>
  <span>
    <span v-if="props.label" class="d-inline-block" :class="props.labelClass">
      {{ props.label }}
    </span>

    <span v-if="props.value && props.relative" id="relative-time">
      <font-awesome-icon
        v-if="props.icon"
        icon="calendar-days"
        :size="props.iconSize"
        :class="[props.iconClass, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
      />
      {{ relativeTime }}
    </span>

    <span v-else-if="props.value && props.humanize" id="humanized-time">
      <font-awesome-icon
        v-if="props.icon"
        icon="calendar-days"
        :size="props.iconSize"
        :class="[props.iconClass, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
      />
      {{ humanizedTime }}
    </span>

    <span v-else-if="props.value" id="date">
      <template v-if="isFinity">
        <span v-if="props.time && props.firstIsDate" class="me-2">
          <font-awesome-icon
            v-if="props.icon"
            icon="clock"
            :size="props.iconSize"
            :class="[props.iconClass, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
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
            :class="[props.iconClass, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
          />

          <span id="get-day" v-if="props.dayName" class="me-2"> {{ getDayName }} </span>
          {{ dateV }}
        </template>

        <span v-if="props.time && !props.firstIsDate" class="ms-2">
          <font-awesome-icon
            v-if="props.icon"
            icon="clock"
            :size="props.iconSize"
            :class="[props.iconClass, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
          />

          <span v-else> {{ $t('shared.clock') }} </span>

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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment-jalaali'
import 'moment-timezone'

const { t } = useI18n()

type Props = {
  value?: string
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
  dataFormat?: string
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
  date: false,
  time: false,
  icon: false,
  dateFormat: 'YYYY/M/D',
  timeFormat: 'HH:mm',
  timeFormatSecond: 'HH:mm:ss',
  iconClass: 'text-info',
  mode: 'date'
})

const isFinity = computed(() => {
  return props.value !== '2999-01-01T00:00:00'
})

const dateFormatV = computed(() => {
  // if (this.$store.state.$locale === 'fa') {
  //   return this.dateFormat.replace(/Y+|M+|D+/g, (m) => `j${m}`)
  // } else {
  return props.dateFormat
  // }
})

const getDayName = computed(() => {
  // if (props.value) {
  // return this.moment.tz(this.$config.timeZone.text).format('dddd')
  // } else {
  return null
  // }
})

const moment = computed<string | null>(() => {
  if (!props.value) return null
  if (props.mode === 'epoch') return moment(Number(props.value))
  else return moment.utc(props.value, 'YYYY-MM-DDTHH:mm:ss.SSS')
})

const dateV = computed(() => {
  // if (props.value) {
  //   return this.moment.tz(this.$config.timeZone.text).format(this.dateFormatV)
  // }
})

const timeV = computed(() => {
  if (props.value) {
    return moment.format(props.timeFormat)
  }
})

const timeVS = computed(() => {
  if (props.value) {
    return moment.format(props.timeFormatSecond)
  }
})

const relativeTime = computed(() => {
  return moment.fromNow()
})

const humanizedTime = computed(() => {
  if (props.time) {
    return moment.calendar()
  } else {
    return moment.calendar(null, {
      sameDay: t('forms.today'),
      nextDay: t('forms.tomorrow'),
      nextWeek: 'dddd',
      lastDay: t('forms.yesterday'),
      lastWeek: t('forms.lastWeekDay'),
      sameElse: dateFormatV
    })
  }
})
</script>
