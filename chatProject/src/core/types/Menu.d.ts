declare interface Menu extends TreeNode<Menu> {
  componentName?: string
  componentExists?: boolean

  // real menu data
  menuId: string
  menuNm?: string
  prMenuId?: string

  programId?: string
  programNm?: string
  programUrl?: string
  menuNmPath?: string
  menuTp?: string

  relPgmExistsYn?: string
  remarkTxt?: string
  sortSeq?: string
  systemCd?: string
  moduleCd?: string
  exclusiveTp?: string
  noticeCnt?: number

  selectYn?: string
  insertYn?: string
  updateYn?: string
  deleteYn?: string
  excelYn?: string
  printYn?: string

  btn01Yn?: string
  btn02Yn?: string
  btn03Yn?: string
  btn04Yn?: string
  btn05Yn?: string

  pSelectYn?: string
  pInsertYn?: string
  pUpdateYn?: string
  pDeleteYn?: string
  pPrintYn?: string
  pExcelYn?: string

  pBtn01Txt?: string
  pBtn01Yn?: string
  pBtn02Txt?: string
  pBtn02Yn?: string
  pBtn03Txt?: string
  pBtn03Yn?: string
  pBtn04Txt?: string
  pBtn04Yn?: string
  pBtn05Txt?: string
  pBtn05Yn?: string
}