import { useAuth, useEventListener, useMenu, VmFlexGrid, vmutil } from '@/core'
import { getCurrentInstance, inject, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, provide, unref } from "vue"
import { openInVsCode } from "../util/openInVsCode"
// import { popupOptionMap } from './usePopupOption'

const loggingVmHook = false
export function useVm<T>(): T & VmController {

  const instance = getCurrentInstance()!
  const { openedMenu } = useMenu()
  const { user } = useAuth()
  const alert = inject<Function>('alert')!
  const confirm = inject<Function>('confirm')!

  // console.log('useVm', instance.type.__file, instance.type.displayName, instance.type.name)
  // let componentName = instance.type.name ?? ''
  // if (import.meta.env.MODE === 'development') {
  //   const lastSlash = instance.type.__file?.lastIndexOf('/')!
  //   const fileName = instance.type.__file?.substring(lastSlash)
  //   // if (fileName?.toLowerCase().includes(componentName.replaceAll('-', '') + '.vue')) {
  //   // console.log('ok', fileName, componentName.replace('-', ''));

  //   // if (componentName.match(/[A-Z]/)) {
  //   //   console.error('defineComponent에서 name을 파일명의 snake-case로 입력해주세요. ' +
  //   //     'file=' + fileName + ' component name=' + componentName)
  //   //   throw 'error'
  //   // }
  //   if (!componentName) {
  //     console.error('useVm()사용시 프로그램이름으로 컴포넌트 이름을 설정하세요. defineComponent의 name 속성', instance.type.__file)
  //     componentName = '컴포넌트 이름을 지어주세요'
  //   }
  // }


  const vm: VmController = {
    // componentName,
    // instance,
    user: unref(user)!,
    // 상단 버튼
    init() {
      console.error(`초기화 init 함수가 정의되지 않았습니다.
                    vm.init = () => {
                      vm.condData.value = {}
                    }`)
    },
    query() {
      console.error(`조회 query 함수가 정의되지 않았습니다.
                    vm.query = async () => {
                      const data = await vm.flex.query('', vm.condData)
                      console.log('query data', data)
                    }`)
    },
    save() {
      console.error(`저장 save 함수가 정의되지 않았습니다.
                    vm.save = async () => {
                      const result = await vm.flex.save('', {})
                      console.log('save result', result)
                    }`)
    },
    addRow() {
      console.error(`행추가 addRow 함수가 정의되지 않았습니다.
                    vm.addRow = () => {
                      vm.flex.addRow({})
                    }`)
    },
    deleteRow() {
      console.error(`행삭제 deleteRow 함수가 정의되지 않았습니다.
                    vm.deleteRow = () => {
                      vm.flex.deleteRow()
                    }`)
    },
    print() {
      console.error(`출력 print 함수가 정의되지 않았습니다.
                    vm.print = () => {
                      //출력 코드
                    }`)
    },
    // 팝업 버튼
    apply() { // 적용 버튼
      import.meta.env.MODE === 'development' &&
        console.error(`적용 apply 함수가 정의되지 않았습니다.
                    vm.apply = () => {
                      // 팝업 결과 적용 코드
                    }`)
    },
    closePopup() { // 닫기 버튼
      instance?.emit('close')
    },
    // util
    updateReacive(src: any, dst: any) {
      for (let k in src) {
        src[k] = undefined
      }
      Object.assign(src, dst)
      // console.log(src, dst);
    },
    requireModels: {},
    async requireCheck(formName?: string): Promise<boolean> {

      if (formName) {
        const models = vm.requireModels[formName]
        return await validateRequired(formName, models)
      } else {
        for (const formName in vm.requireModels) {
          console.log(formName, vm.requireModels[formName])
          const models = vm.requireModels[formName]
          const result = await validateRequired(formName, models)
          if (result === false) return false
        }
      }

      return true
    },

    // checkRequire(data: any, items: string[]): boolean {
    //   if (data && items && items.length) {
    //     for (let i = 0; i < items.length; i += 2 ) {
    //       const item = items[i]
    //       const label = items[i+1]
    //       const value = data[item]

    //       if (value === null || value === undefined || value === '') {
    //         this.alert( josa(label, '은') + ' 필수 입니다.')
    //         return false;
    //       }
    //     }
    //   }
    //   return true
    // },


    // alert, confirm
    async alert(message: string): Promise<any> {
      const answer = await alert(message)
      return answer
      // return app.config.globalProperties.alertOpen(message)
    },
    async confirm(message: string): Promise<any> {
      const answer = await confirm(message)
      return answer
      // return app.config.globalProperties.confirmOpen(message)
    },
    async yesOrNo(message: string, option?: any): Promise<any> {
      const answer = await confirm(message, {
        ...option
      })
      return answer
      // return app.config.globalProperties.yesOrNoOpen(message, { ...option })
    },

    // vm-tab
    // activated() {
    //   console.error(`탭 활성`)
    // },
    // deactivated() {
    //   console.error(`탭 비활성`)
    // },
  }

  async function validateRequired(formName: string, models: string[]): Promise<boolean> {
    for (let i = 0; i < models.length; i++) {
      const usedVm = vm as any
      const model = models[i]
      const value = usedVm[formName][model]
      const inputRef = usedVm[formName + '_' + model + 'Ref']
      const label = inputRef.value.ariaLabel || inputRef.value.placeholder
      if (value === null || value === undefined || value === '') {
        await vm.alert(vmutil.josa(label, '은') + ' 필수 입니다.')
        inputRef.value.focus()
        return false
      }
    }
    return true
  }

  onBeforeMount(() => {
    // if (loggingVmHook)
      // console.log('useVm onBeforeMount ', instance?.type.name, instance, openedMenu.value.menuNm)

    // 메뉴트리에 현재 vm을 연결시킴
    // const foundMenu = treeRef?.value?.findNode('componentName', componentName)
    // if (foundMenu) {
    //   foundMenu.vm = vm
    // }
  })
  
  onMounted(() => {
    if (loggingVmHook) console.log('useVm onMounted ', instance?.type.name, instance, vm, openedMenu.value)

    if (import.meta.env.MODE === 'development') {
      const { name, __file: file } = instance.type
      // const popupOption = popupOptionMap.get(name!)
      // // const popupOption = useModalOption(name!)  
      // if (popupOption) {
      //   const el = instance.vnode.el as HTMLElement
      //   const mc = el.closest('.modal-container')
      //   const dubugSpan = document.createElement('span')
      //   dubugSpan.style.position = 'absolute'
      //   dubugSpan.style.cursor = 'pointer'
      //   dubugSpan.style.bottom = '10px'

      //   dubugSpan.style.backgroundColor = 'yellow'
      //   dubugSpan.style.height = '30px'
      //   useEventListener(dubugSpan, 'click', () => {
      //     openInVsCode(file)
      //   }, { desc: '소스 열기 클릭' })
      //   dubugSpan.textContent = name + ' : ' + file + '  [열기]'
      //   mc?.append(dubugSpan)
      // }
      window.vm = vm
    }
  })
  onBeforeUpdate(() => {
    if (loggingVmHook) console.log('useVm onBeforeUpdate ', instance?.type.name, instance)
  })
  onUpdated(() => {
    if (loggingVmHook) console.log('useVm onUpdated ', instance?.type.name, instance)
  })
  onBeforeUnmount(() => {
    if (loggingVmHook) console.log('useVm onBeforeUnmount ', instance?.type.name, instance)
  })
  onUnmounted(() => {
    if (loggingVmHook) console.log('useVm onUnmounted ', instance?.type.name, instance)

    console.group('unmounted', vm);
    for (let k in vm) {
      // @ts-ignore
      const v = vm[k]
      if (!v) continue
      // console.log(k, v);
      if (typeof v.dispose === 'function') {
        console.log('dispose', vm);
        v.dispose()
      }
      // @ts-ignore
      vm[k] = null
    }

    if (import.meta.env.MODE === 'development') {
      window.vm = null
      window.vm = instance.props.parentVm as VmController
    }
    console.groupEnd();
  })
  onErrorCaptured((err) => {
    if (loggingVmHook) console.log('useVm onErrorCaptured ', instance, err)
  })
  onRenderTracked(() => {
    if (loggingVmHook) console.log('useVm onRenderTracked ', instance)
  })
  onRenderTriggered(() => {
    if (loggingVmHook) console.log('useVm onRenderTriggered ', instance)
  })

  // onActivated(() => {
  //   // if (loggingVmHook) console.log('useVm onActivated ', instance?.type.name, instance)
  //   triggerResize()
  // })
  // onDeactivated(() => {
  //   if (loggingVmHook) console.log('useVm onDeactivated ', instance?.type.name, instance)
  // })

  provide('vm', vm)
  return vm as T & VmController
}
