// import VmColumn  from '../components/grid/VmColumn'

/**
 * wijmo의 Column은 모든 속성이 필수라서 Partial
 */
// declare type VmFlexColumn = Partial<VmColumn>
declare type VmFlexColumn = Partial<import('../components/grid/VmColumn').VmColumn>

// // declare interface CollectionViewItem {
// //   _index_?: number // 조회했을때의 원래 순서
// //   _si_?: number // 저장할때 순서
// //   _tr_?: import('../enum/TrackType').TrackType // 저장할때 타입
// //   // [index: string]: any
// // }


declare interface VmDataMap {
  tableId?: string // 쿼리 id
  code?: string // 공통코드의 코드
  optionFirst?: import('../enum/OptionFirst').OptionFirst // 전체 선택
  parent?: string // 상하위 관계일때 상위  binding
  child?: string // 상하위 관계일때 하위 binding
  shortCut?: string // 단축키
}

// /**
//  * 그리드의 행삭제 파라미터
//  */
// declare interface DeleteParam {
//   /**
//    * 프로그램으로 선택 또는 체크한 item의 배열 
//    */
//   items?: Array<object>
//   // /**
//   //  * 삭제할 index의 배열
//   //  */
//   // indexes?: Array<number>
//   // /**
//   //  * 
//   //  */
//   // current?: object,
//   // message?: string | boolean
// }
