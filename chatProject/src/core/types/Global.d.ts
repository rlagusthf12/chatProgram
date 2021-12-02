declare interface wijmo {
  input: any
  grid: import('wijmo/wijmo.grid').FlexGrid
}
declare interface Window {
  $: JQuery,
  wijmo: wijmo
  vm?: VmController | null
  debugvm: any
}


declare interface StringIndexed<T> {
  [index: string]: T
}