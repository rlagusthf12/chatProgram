import { getCurrentInstance, onMounted, onUnmounted } from "vue"


export function useResize(resizeCallback: Function) {
  
  
  function resizeHandler() {
    resizeCallback()
  }
  const instance = getCurrentInstance()

  onMounted(() => { 
    window.addEventListener('resize', resizeHandler)
  })
  onUnmounted(() => { 
    window.removeEventListener('resize', resizeHandler)
  })
}