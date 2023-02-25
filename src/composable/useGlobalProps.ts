import { getCurrentInstance, type ComponentInternalInstance } from 'vue'

export default function () {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  const globalProps = appContext.config.globalProperties
  return { ...globalProps }
}
