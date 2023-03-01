<script setup lang="ts">
import DateTimePicker from '@/components/DateTimePicker/index.vue'
import { ref } from 'vue'

const date = ref('2021-10-21')
</script>

<template>
  <div class="container my-5">
    <DateTimePicker
      v-model="date"
      placeholder="زمان و ساعت را انتخاب کنید"
      prepend="prepend"
      type="datetime"
      :custom-input="`.custom-input`"
      auto-submit
    />
    {{ date }}
  </div>
</template>
