declare interface VmTabType {
  id: string
  title: string
  isActive?: boolean
  isDisabled?: import('vue').ComputedRef<boolean>
  // isDisabled?: Ref<boolean>
  index: number
}


declare interface VmTabsType {
  activeId: string
  lastActiveId: string
  tabs: VmTabType[]
  activeTab: VmTabType | null
}

