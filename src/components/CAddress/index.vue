<template>
  <div class="row">
    <div class="col-12" :class="`col-md-${props.mdCols}`">
      <div class="form-group">
        <AutoComplete
          v-model="model.provinceId"
          :prepend="$t('shared.province')"
          :name="$t('shared.province')"
          :search="getProvinces"
          :select="selectProvince"
          :extendFilter="{ 'sort[0].column': 'name', 'sort[0].type': 'ASCENDING' }"
          no-badge
          required
          v-validate="'required'"
          @select="callNextRequest('province')"
          @change="clearAddressData('province')"
        />
      </div>

      <div class="form-group">
        <AutoComplete
          v-model="model.countyId"
          :prepend="$t('shared.county')"
          :name="$t('shared.county')"
          :search="getCounties"
          :select="selectCounty"
          :extendFilter="{ 'sort[0].column': 'name', 'sort[0].type': 'ASCENDING' }"
          no-badge
          :disabled="!model.provinceId"
          :required="!!model.countyId || hasCounty"
          v-validate="{ required: !!model.countyId || hasCounty }"
          @select="callNextRequest('county')"
          @change="clearAddressData('county')"
        />
      </div>

      <div class="form-group">
        <AutoComplete
          v-model="model.cityId"
          :prepend="$t('shared.city')"
          :name="$t('shared.city')"
          :search="getCities"
          :select="selectCity"
          :extendFilter="{ 'sort[0].column': 'name', 'sort[0].type': 'ASCENDING' }"
          no-badge
          :required="!!model.cityId || hasCity"
          :disabled="!model.countyId"
          v-validate="{ required: !!model.cityId || hasCity }"
          @select="callNextRequest('city')"
          @change="clearAddressData('city')"
        />
      </div>

      <div class="form-group">
        <AutoComplete
          v-model="model.suburbId"
          :prepend="$t('shared.suburb')"
          :name="$t('shared.suburb')"
          :search="getSuburbs"
          :select="selectSuburb"
          :required="!!model.suburbId || hasSuburb"
          :extendFilter="{ 'sort[0].column': 'name', 'sort[0].type': 'ASCENDING' }"
          no-badge
          :disabled="!model.cityId"
          v-validate="{ required: !!model.suburbId || hasSuburb }"
          @select="callNextRequest('suburb')"
          @change="clearAddressData('suburb')"
        />
      </div>

      <div class="form-group">
        <AutoComplete
          v-model="model.neighborhoodId"
          :prepend="$t('shared.neighborhood')"
          :name="$t('shared.neighborhood')"
          :search="getNeighborhoods"
          :select="selectNeighborhood"
          :required="!!model.neighborhoodId || hasNeighborhood"
          :extendFilter="{ 'sort[0].column': 'name', 'sort[0].type': 'ASCENDING' }"
          no-badge
          :disabled="!model.suburbId"
          v-validate="{ required: !!model.neighborhoodId || hasNeighborhood }"
          @change="clearAddressData('neighborhood')"
        />
      </div>
    </div>

    <div class="col-12" :class="`col-md-${props.mdCols}`">
      <div class="form-group">
        <RInputGroup :prepend="$t('shared.plaque')">
          <RFormInput v-model="plaque" dir="auto" />
        </RInputGroup>
      </div>

      <div class="form-group">
        <RInputGroup :prepend="$t('shared.unit')">
          <RFormInput v-model="unit" dir="auto" />
        </RInputGroup>
      </div>

      <div class="form-group">
        <RInputGroup :prepend="$t('shared.streetInfo')">
          <RFormTextarea
            v-model="model.streetInfo"
            :name="$t('shared.streetInfo')"
            rows="6"
            no-resize
            v-validate="'required'"
            dir="auto"
          />
        </RInputGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed } from 'vue'
import { RFormTextarea, RInputGroup, RFormInput } from '@routaa/ui-kit'
import useGlobalProps from '../../composable/useGlobalProps'
import AutoComplete from '../AutoComplete/index.vue'

const globalProps = useGlobalProps()

const emit = defineEmits<emit>()

const plaque = ref('')
const unit = ref('')
const hasCounty = ref<boolean>(false)
const hasCity = ref<boolean>(false)
const hasSuburb = ref<boolean>(false)
const hasNeighborhood = ref<boolean>(false)
const counties = ref([])
const cities = ref([])
const suburbs = ref([])
const neighborhoods = ref([])

type ModelValue = {
  countryId: number
  countyId: number
  cityId: number
  suburbId: number
  neighborhoodId: number
  provinceId: number
  lat: number
  lng: number

  unitInfo: string
  cityInfo: object
  streetInfo: object
  countyInfo: object
  suburbInfo: object
  neighborhoodInfo: object
  provinceInfo: object
}

interface emit {
  (e: 'updated:modelValue', val: ModelValue): void
}


type Center = {
  lat: number
  lng: number
}

type Error = {
  data?: string
  errorCode?: number
  status?: number
  code?: number
}

type Properties = {
  country: string
  state: string
  county: string
  city: string
  district: string
  suburb: string
  neighborhood: string
  name: string
}

type ResponseType = { id: number; properties: Properties }

type CountryDivisionsApi = {
  self: Function
  countries: Function
  provinces: Function
  counties: Function
  cities: Function
  suburbs: Function
  neighborhoods: Function
}

type Props = {
  modelValue: ModelValue
  center?: Center
  mdCols?: string
  countryDivisionsApi: CountryDivisionsApi
  reverseSearchApi: Function
}

const props = withDefaults(defineProps<Props>(), {
  mdCols: '6'
})

// created() {
//   this.$validator = this.$parent.$validator
// }

onMounted(() => {
  getCountries()
  splitUnitInfo()
  if (!props.modelValue?.streetInfo) getStreetInfo()
})

const model = computed({
  get() {
    return props.modelValue
  },
  set(val: ModelValue) {
    emit('updated:modelValue', val)
  }
})

function getCountries() {
  return props.countryDivisionsApi.countries().then((res: ResponseType[]) => (props.modelValue.countryId = res[0]?.id))
}

function getProvinces(filter: object) {
  return props.countryDivisionsApi.provinces(props.modelValue.countryId, filter)
}

function selectProvince() {
  return Promise.resolve(props.modelValue?.provinceInfo)
}

function getCounties(filter: object) {
  return props.countryDivisionsApi.counties(props.modelValue?.provinceId, filter).then((res: ResponseType[]) => {
    hasCounty.value = !!res.length
    return res
  })
}

function selectCounty() {
  return Promise.resolve(props.modelValue?.countyInfo)
}

function getCities(filter: object) {
  return props.countryDivisionsApi.cities(props.modelValue?.countyId, filter).then((res: ResponseType[]) => {
    hasCity.value = !!res.length
    return res
  })
}

function selectCity() {
  return Promise.resolve(props.modelValue?.cityInfo)
}

function getSuburbs(filter: object) {
  return props.countryDivisionsApi.suburbs(props.modelValue?.cityId, filter).then((res: ResponseType[]) => {
    hasSuburb.value = !!res.length
    return res
  })
}

function selectSuburb() {
  return Promise.resolve(props.modelValue?.suburbInfo)
}

function getNeighborhoods(filter: object) {
  return props.countryDivisionsApi.neighborhoods(props.modelValue?.suburbId, filter).then((res: ResponseType[]) => {
    hasNeighborhood.value = !!res.length
    return res
  })
}

function selectNeighborhood() {
  return Promise.resolve(props.modelValue?.neighborhoodInfo)
}

function callNextRequest(countryDivision: string | number) {
  const fakeKeyword = { keyword: null }
  nextTick(() => {
    if (countryDivision === 'province' && props.modelValue?.provinceId) getCountries()
    else if (countryDivision === 'county' && props.modelValue?.countyId) getCities(fakeKeyword)
    else if (countryDivision === 'city' && props.modelValue?.cityId) getSuburbs(fakeKeyword)
    else if (countryDivision === 'suburb' && props.modelValue?.suburbId) getNeighborhoods(fakeKeyword)
  })
}

function splitUnitInfo() {
  if (props.modelValue?.unitInfo) {
    const unitInfo = props.modelValue?.unitInfo.split(',')
    plaque.value = unitInfo[0]
    unit.value = unitInfo[1]
  }
}

function errorHandler(errors: Error | Error[] | null) {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      if (typeof error === 'object') throwError(error)
    })
  } else throwError(errors)
}

const throwError = (error: Error | null): void => {
  if (error && error.data) throw new Error(error.data)
}

async function getStreetInfo() {
  try {
    const items = await props.reverseSearchApi({
      destinationLat: props.center?.lat || props.modelValue.lat || globalProps.$config.map.defaultLat,
      destinationLon: props.center?.lng || props.modelValue.lng || globalProps.$config.map.defaultLng
    })

    if (items && items.length) {
      const properties = items[0].properties
      let address = []
      if (properties.country) address.push(properties.country)
      if (properties.state) address.push(properties.state)
      if (properties.county) address.push(properties.county)
      if (properties.city) address.push(properties.city)
      if (properties.district) address.push(properties.district)
      if (properties.suburb) address.push(properties.suburb)
      if (properties.neighborhood) address.push(properties.neighborhood)
      if (properties.name) address.push(properties.name)
      model.value.streetInfo = address.join(' ')
    }
  } catch (err) {
    if (typeof err === 'object') errorHandler(err)
  }
}

function clearAddressData(item: string) {
  if (item === 'province') {
    counties.value = []
    cities.value = []
    suburbs.value = []
    neighborhoods.value = []
    model.value.countyId = null
    model.value.cityId = null
    model.value.suburbId = null
    model.value.neighborhoodId = null
    hasCounty.value = false
    hasCity.value = false
    hasSuburb.value = false
    hasNeighborhood.value = false
  } else if (item === 'county') {
    cities.value = []
    suburbs.value = []
    neighborhoods.value = []
    model.value.cityId = null
    model.value.suburbId = null
    model.value.neighborhoodId = null
    hasCity.value = false
    hasSuburb.value = false
    hasNeighborhood.value = false
  } else if (item === 'city') {
    hasSuburb.value = false
    hasNeighborhood.value = false
    suburbs.value = []
    neighborhoods.value = []
    model.value.suburbId = null
    model.value.neighborhoodId = null
  } else if (item === 'suburb') {
    hasNeighborhood.value = false
    neighborhoods.value = []
    model.value.neighborhoodId = null
  }
}

function generateUnitInfo() {
  // DON'T REMOVE THIS FUNCTION
  // Call from parent
  model.value.unitInfo = [plaque.value, unit.value].filter(Boolean).join(',')
}
</script>
