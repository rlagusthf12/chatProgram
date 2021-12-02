import { getCurrentInstance, onUnmounted } from 'vue'
import { Fn } from './utils/types'

/**
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 *
 * @param fn
 */
export function tryOnUnmounted(fn: Fn) {
  if (getCurrentInstance()) {
    const ii = getCurrentInstance()
    console.log('try', ii)
    onUnmounted(fn)
  }
}
