import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {} from '@fortawesome/free-regular-svg-icons'

import {
  faCalendarDays,
  faClock,
  faFilter,
  faInfinity,
  faList,
  faRotateLeft,
  faUserGear
} from '@fortawesome/free-solid-svg-icons'

library.add(faRotateLeft, faInfinity, faClock, faCalendarDays, faList, faUserGear, faFilter)

export default FontAwesomeIcon
