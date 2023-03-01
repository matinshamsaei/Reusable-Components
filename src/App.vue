<script setup lang="ts">
import { ref } from 'vue'
import Uploader from './components/Uploader/index.vue'

const model = ref('')

async function uploadReq(files: FileList, serverType = 'userManagement', onUploadProgress: number) {
  const formData = new FormData()

  Array.from(files).forEach((file) => {
    formData.append('files', file, file.name)
  })

  const item = await fetch('http://192.168.7.16:8082/api/pub/files/temp', {
    method: 'POST',
    body: formData
  })

  return item.json()
}
</script>

<template>
  welcome to shared components

  <div class="container">
    <Uploader v-model="model" disabled :upload-req="uploadReq" />
  </div>
</template>
