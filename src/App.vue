<script setup lang="ts">
import FileManager from '@/components/FileManager/index.vue'

// http://192.168.7.16/routaa-app/api/admin/article/docs/FILE?path=

function getFolderByPath(type: string, path: string) {
  // return props.getAllInfoApi(filter)
  return fetch(`http://192.168.7.16/business/api/admin/widgets/folders/IMAGE?path=${path}`, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACWOUQ7CIBBE77LfxUDpwtK_3sELFFwSNIrptonReHch_r6ZN5kPHOUC84R2ADkizLCkxCLneuMHDFBEGkv1foq81freWNa1B_x6wmwcaUL0GFpz3f_A0Rg6uO6lqTGZbG2wSmsf1cQJVcyEyviMgcn4KY9tTvoLIme-P2Lx1B-SAAAA.Gzf7KCFDqrgvMiQS0SWFVVFVn7Qnouf7DWbO9rFnzJjrtInY1D5rWQHgYTm2bII61UhkJoTMVEHBZ3lpbZDCnA'
    }
  })
    .then((response) => response.json())
    .then((data) => data)
}

function createFolder(type: string, path: string) {
  return fetch(`http://192.168.7.16/business/api/admin/widgets/folders/IMAGE?path=${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACWOUQ7CIBBE77LfxUDpwtK_3sELFFwSNIrptonReHch_r6ZN5kPHOUC84R2ADkizLCkxCLneuMHDFBEGkv1foq81freWNa1B_x6wmwcaUL0GFpz3f_A0Rg6uO6lqTGZbG2wSmsf1cQJVcyEyviMgcn4KY9tTvoLIme-P2Lx1B-SAAAA.Gzf7KCFDqrgvMiQS0SWFVVFVn7Qnouf7DWbO9rFnzJjrtInY1D5rWQHgYTm2bII61UhkJoTMVEHBZ3lpbZDCnA'
    }
  })
    .then((response) => {
      return response ? response.json() : Promise.resolve(null)
    })
    .then((data) => {
      console.log(data)
      return data
    })
}

function renameFolder(type: string, path: string, oldName: string, newName: string) {
  return fetch(
    `http://192.168.7.16/business/api/admin/widgets/folders/IMAGE?path=${path}&oldName=${oldName}&newName=${newName}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACWOUQ7CIBBE77LfxUDpwtK_3sELFFwSNIrptonReHch_r6ZN5kPHOUC84R2ADkizLCkxCLneuMHDFBEGkv1foq81freWNa1B_x6wmwcaUL0GFpz3f_A0Rg6uO6lqTGZbG2wSmsf1cQJVcyEyviMgcn4KY9tTvoLIme-P2Lx1B-SAAAA.Gzf7KCFDqrgvMiQS0SWFVVFVn7Qnouf7DWbO9rFnzJjrtInY1D5rWQHgYTm2bII61UhkJoTMVEHBZ3lpbZDCnA'
      }
    }
  )
    .then((response) => {
      return response ? response.json() : Promise.resolve(null)
    })
    .then((data) => {
      console.log(data)
      return data
    })
}

const api = {
  getFolderByPath,
  renameFolder,
  createFolder
}
</script>

<template>
  <div class="container mt-3">
    <FileManager :api="api" />
  </div>
</template>
