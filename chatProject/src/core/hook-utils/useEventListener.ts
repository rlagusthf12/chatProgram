import { tryOnMounted } from "./tryOnMounted"
import { tryOnUnmounted } from "./tryOnUnmounted"
import { vmutil } from '@/core'

export function useEventListener(...args: any[]) {
  let target: EventTarget | undefined
  let event: string
  let listener: any
  let options: any
  
  if (vmutil.is.string(args[0])) {
    [event, listener, options = {}] = args
    target = window
  } else {
    [target, event, listener, options = {}] = args
  }

  if (!target) { 
    return
  }

  let stopped = false

  target.addEventListener(event, listener, options)
  console.log('[useEventListener: addEventListener] added.', options.desc, '이벤트=', event);

  if (options.immediate) {
    tryOnMounted(listener)
  }

  const stop = () => {
    if (stopped) return
    target!.removeEventListener(event, listener, options)
    console.log('[useEventListener: addEventListener] removed.', options.desc, '이벤트=', event);
    stopped = true
  }

  tryOnUnmounted(stop)

  return stop
}