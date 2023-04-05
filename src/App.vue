<script setup lang="ts">
import FileManager from '@/components/FileManager/index.vue'

// http://192.168.7.16/routaa-app/api/admin/article/docs/FILE?path=

function getFolderByPath() {
  // return props.getAllInfoApi(filter)
  return fetch(`http://192.168.7.16/business/api/admin/widgets/folders/IMAGE?path=`, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACWOUQ7CIBBE77LfxUDpwtK_3sELFFwSNIrptonReHch_r6ZN5kPHOUC84R2ADkizLCkxCLneuMHDFBEGkv1foq81freWNa1B_x6wmwcaUL0GFpz3f_A0Rg6uO6lqTGZbG2wSmsf1cQJVcyEyviMgcn4KY9tTvoLIme-P2Lx1B-SAAAA.Gzf7KCFDqrgvMiQS0SWFVVFVn7Qnouf7DWbO9rFnzJjrtInY1D5rWQHgYTm2bII61UhkJoTMVEHBZ3lpbZDCnA'
    }
  })
    .then((response) => response.json())
    .then((data) => data)
}

const api = {
  getFolderByPath
}
</script>

<template>
  <div class="container mt-3">
    <FileManager :api="api" />
  </div>
</template>
