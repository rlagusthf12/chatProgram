
declare interface TreeNode<T> {

  lv?: number
  isCollapsed?: boolean
  htmlElement?: HTMLElement
  parent?: T //& TreeNode<T>
  child?: Array<T>
  icon?: string
  // next?: TreeNode<T>
  // prev?: TreeNode<T>
  hidden?: boolean // 트리에서 안보여줌
}
