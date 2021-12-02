declare interface VmController {
  componentName?: string
  instance?: import('vue').ComponentInternalInstance
  user: User
  init(): void
  query(): void
  save(): void
  addRow(): void
  deleteRow(): void
  print(): void
  // flexInit(s: import('@/core').VmFlexGrid): void
  apply(): void // 팝업 '적용' 버튼
  closePopup(): void // 팝업 닫기
  /**
   * 초기화와 같이 모든 필드의 값을 변경할 때는 reactive()를 다시하면 않되고 updateReacive()로 초기화 한다.  
   * vm.init = () => {  
   *   vm.updateReacive(vm.condData, condData)  
   * }
   */
  updateReacive(oldData: any, newData: any): void
  requireModels: any
  // checkRequire(data: any, items: string[]): boolean
  requireCheck(formName?: string): Promise<boolean>
  activated?(newMenu: Menu, oldMenu?: Menu): void
  deactivated?(oldMenu: Menu): void
  alert(message: string): Promise<any>
  confirm(message: string): Promise<any>
  yesOrNo(message: string, option?: any): Promise<any>

}
