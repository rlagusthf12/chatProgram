
declare interface PopupParam {
  popupName: string
  corpCd: string
  code: string
  // name: string
}

declare interface PopupResult {
  popupResultCount?: number
  code?: string
  name?: string
  item?: any
  event?: Event
}