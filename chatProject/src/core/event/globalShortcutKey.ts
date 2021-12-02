import { Ref } from "vue"

// HMR로 중복 등록 방지
let isRegistered = false
const acceptElement = ['INPUT', 'SELECT', 'TEXTAREA']

export default function globalShortcutKey(currentTab: Ref<Menu>) {

  if (isRegistered) return
  isRegistered = true
  // console.log('window keyup event >>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    console.log(currentTab.value.menuId, currentTab.value.menuNm);
    
    const target = e.target as HTMLElement
    if (!acceptElement.includes( target.tagName) ) {
      return
    }

    // const vm = currentTab.value.vm
    // if ( !vm ) return
    // if (['F1', 'F3', 'F51', 'F6', 'F7', 'F8', 'F9', 'Enter'].includes(e.key)) {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   console.log('[keydown]', e, currentTab, e.key, 'alt', e.altKey, 'ctrl', e.ctrlKey, 'shift', e.shiftKey, 'vm', window.vm);

    //   switch (e.key) {
    //     case 'F1': break;
    //     case 'F3': break;
    //     case 'F5':
    //       if ( e.ctrlKey) window.location.reload()
    //       break
    //     case 'F6':
    //       vm.query(); break;
    //     case 'F7': vm.addRow(); break;
    //     case 'F8': vm.deleteRow(); break;
    //     case 'F9': vm.save(); break;
    //     case 'Enter':
    //       console.log('Enter => focus next element');
    //       break;
    //   }
    // }
    
  })
  // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<< window keyup event');
  
}