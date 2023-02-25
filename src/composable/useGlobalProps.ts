import { getCurrentInstance, type ComponentInternalInstance } from 'vue'
import type { SharedComponentOptions } from '../RoutaaSharedComponents'

export default function () {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance & SharedComponentOptions
  const globalProps = appContext.config.globalProperties
  return { ...globalProps }
}
