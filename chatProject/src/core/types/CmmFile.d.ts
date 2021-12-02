// import type { VmCollectionViewItem } from ".."

type VCVI = import('../components/grid/VmCollectionView').VmCollectionViewItem
declare interface CmmFile extends VCVI {
// declare interface CmmFile extends VmCollectionViewItem {
  fileNo?: string | null
  corpCd?: string | null
  fileDiv?: string | null
  fileSeq?: number | null
  drivPath?: string | null
  filePath?: string | null
  fileNm?: string | null
  descTxt1?: string | null
  descTxt2?: string | null
  relKey1?: string | null
  relKey2?: string | null
  relKey3?: string | null
  relKey4?: string | null
  relKey5?: string | null
  tempFileKey?: string
  type?: string
  size?: number
}

declare interface UploadSaveData {
  addFileData: CmmFile[]
  removeFileData: CmmFile[]
  files: File[]
}
