import type { Directive, DirectiveBinding } from 'vue'

export default {
  beforeMount(el, binding: DirectiveBinding) {
    el.clickOutsideEvent = (event) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
} as Directive<HTMLElement>
