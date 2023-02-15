<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import type { IObject } from '../../utils/object'
import download from 'downloadjs'

type Props = {
  fields: object
  data?: object[]
  name?: string
  type?: 'xls' | 'csv' | 'html'
  exportFields?: object
  defaultValue?: string
  header?: string
  footer?: string
  fetch?: Function
  worksheet?: string
  beforeGenerate?: Function
  beforeFinish?: Function
  escapeCsv?: boolean
  stringifyLongNum?: boolean
}

type Key = {
  field: string
  callback: Function
}

const props = withDefaults(defineProps<Props>(), {
  type: 'xls',
  defaultValue: '',
  name: 'data.xls',
  worksheet: 'Sheet1',
  stringifyLongNum: false
})

const idName = computed(() => {
  const now: number = new Date().getTime()
  return `export_${now}`
})

const attrs = useAttrs()

const downloadFields = computed(() => {
  if (props.fields) return props.fields
  if (props.exportFields) return props.exportFields
})

async function generate() {
  if (typeof props.beforeGenerate === 'function') await props.beforeGenerate()
  let data = props.data
  const name: string = props.name
  const type = props.type
  if (typeof props.fetch === 'function') data = await props.fetch()

  if (!data || !data.length) return

  const field: object = downloadFields && downloadFields.value ? downloadFields.value : {}
  let json: object[] = getProcessedJson(data, field)
  if (type === 'html') {
    return exportItem(jsonToXLS(json), name.replace('.xls', '.html'), 'text/html')
  } else if (type === 'csv') {
    return exportItem(jsonToCSV(json), name.replace('.xls', '.csv'), 'application/csv')
  }
  return exportItem(jsonToXLS(json), name, 'application/vnd.ms-excel')
}

/*
		jsonToXLS
		---------------
		Transform json data into an xml document with MS Excel format, sadly
		it shows a prompt when it opens, that is a default behavior for
		Microsoft office and cannot be avoided. It's recommended to use CSV format instead.
		*/
function jsonToXLS(data: object[]) {
  let xlsData = '<thead>'
  const colspan = Object.keys(data[0]).length
  //Header
  const header = props.header || attrs.title
  if (header) {
    xlsData += parseExtraData(header, '<tr><th colspan="' + colspan + '">${data}</th></tr>')
  }
  //Fields
  xlsData += '<tr>'
  for (let key in data[0]) {
    xlsData += '<th>' + key + '</th>'
  }
  xlsData += '</tr>'
  xlsData += '</thead>'
  //Data
  xlsData += '<tbody>'
  data.map((item: IObject) => {
    xlsData += '<tr>'
    for (let key in item) {
      xlsData += '<td>' + preProcessLongNum(valueReformattedForMultiline(item[key])) + '</td>'
    }
    xlsData += '</tr>'
  })
  xlsData += '</tbody>'
  //Footer
  if (props.footer !== null) {
    xlsData += '<tfoot>'
    const footer = props.footer ? props.footer : ''
    xlsData += parseExtraData(footer, '<tr><td colspan="' + colspan + '">${data}</td></tr>')
    xlsData += '</tfoot>'
  }
  const xlsTemp = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40" lang="fa">
          <head>
            <meta name=ProgId content=Excel.Sheet>
            <meta name=Generator content="Microsoft Excel 11">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>${props.worksheet}</x:Name>
                      <x:WorksheetOptions>
                        <x:DisplayRightToLeft/>
                        <x:DisplayGridlines/>
                      </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
              </xml>
            <!--[if gte mso 9]>
            <![endif]-->
            <style>br {mso-data-placement: same-cell;}</style>
          </head>
          <body>
            <table>${xlsData}</table>
          </body>
        </html>
      `
  return xlsTemp
}

/*
  jsonToCSV
  ---------------
  Transform json data into an CSV file.
  */
function jsonToCSV(data: IObject[]) {
  let csvData: string[] = []
  //Header
  const header = props.header || attrs.title
  if (header) {
    csvData.push(parseExtraData(header, '${data}\r\n'))
  }
  //Fields
  for (let key in data[0]) {
    csvData.push(key)
    csvData.push(',')
  }
  csvData.pop()
  csvData.push('\r\n')
  //Data
  data.map((item) => {
    for (let key in item) {
      let escapedCSV = item[key] + ''
      // Escaped CSV data to string to avoid problems with numbers or other types of values
      // this is controlled by the prop escapeCsv
      if (props.escapeCsv) {
        escapedCSV = '="' + escapedCSV + '"' // cast Numbers to string
        if (escapedCSV.match(/[,"\n]/)) {
          escapedCSV = '"' + escapedCSV.replace(/\"/g, '""') + '"'
        }
      }
      csvData.push(escapedCSV)
      csvData.push(',')
    }
    csvData.pop()
    csvData.push('\r\n')
  })
  //Footer
  if (props.footer != null) csvData.push(parseExtraData(props.footer, '${data}\r\n'))

  return csvData.join('')
}

function valueReformattedForMultiline(value: string): any {
  if (typeof value == 'string') return value.replace(/\n/gi, '<br/>')
  else return value
}

function preProcessLongNum(value: number): string | number {
  if (props.stringifyLongNum) {
    if (String(value).startsWith('0x')) return value

    if (!isNaN(value)) {
      if (value > 99999999999 || value < 0.0000000000001) return '="' + value + '"'
    }
  }
  return value
}
/*
  parseExtraData
  ---------------
  Parse title and footer attribute to the csv format
*/
function parseExtraData(extraData: IObject | string, format: string): string {
  let parseData = ''
  if (Array.isArray(extraData)) {
    for (let i = 0; i < extraData.length; i++) {
      if (extraData[i]) parseData += format.replace('${data}', extraData[i])
    }
  } else {
    extraData = ''
    parseData += format.replace('${data}', extraData)
  }
  return parseData
}

async function exportItem(data: string, filename: string, mime: string) {
  let blob = base64ToBlob(data, mime)
  if (typeof props.beforeFinish === 'function') await props.beforeFinish()
  download(blob, filename, mime)
}

/*
  getProcessedJson
  ---------------
  Get only the data to export, if no fields are set return all the data
*/
function getProcessedJson(data: object[], header: object): object[] {
  let keys: IObject = getKeys(data, header)
  let newData: object[] = []
  data.map((item) => {
    let newItem: IObject = []
    for (let label in keys) {
      let property = keys[label]
      newItem[label] = getValue(property, item)
    }
    newData.push(newItem)
  })
  return newData
}

function getKeys(data: object[], header: object): object {
  if (header) return header
  let keys: IObject = {}
  for (let key in data[0]) {
    keys[key] = key
  }

  return keys
}

function getValue(key: Key, item: IObject) {
  const field: string = typeof key !== 'object' ? key : key.field
  let indexes: string[] = typeof field !== 'string' ? [] : field.split('.')
  let value: string | IObject = props.defaultValue
  if (!field) value = item
  else if (indexes.length > 1) value = getValueFromNestedItem(item, indexes)
  else value = parseValue(item[field])
  if (key.hasOwnProperty('callback')) value = getValueFromCallback(value, key.callback)
  return value
}

function getValueFromNestedItem(item: object, indexes: string[]) {
  let nestedItem: IObject = item
  for (let index of indexes) {
    if (nestedItem) nestedItem = nestedItem[index]
  }
  return parseValue(nestedItem)
}

function getValueFromCallback(item: IObject | string, callback: Function) {
  if (typeof callback !== 'function') return props.defaultValue
  const value = callback(item)
  return parseValue(value)
}

function parseValue(value: any) {
  return value || value === 0 || typeof value === 'boolean' ? value : props.defaultValue
}

function base64ToBlob(data: string, mime: string) {
  let base64 = window.btoa(window.unescape(encodeURIComponent(data)))
  let bstr = atob(base64)
  let n = bstr.length
  let u8arr = new Uint8ClampedArray(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
</script>

<template>
  <div :id="idName" @click="generate">
    <slot> {{ props.name }} </slot>
  </div>
</template>
