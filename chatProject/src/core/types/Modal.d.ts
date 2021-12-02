declare interface VmModal {
  /**
   * 모달 창을 오픈한다.
   * @param 팝업창에 전달할 파라미터
   * @return 팝업에서 처리한 결과 데이터
   */
  open: (param?: any) => Promise<any>

  /**
   * 모달 창을 닫는다.
   * 파라미터로 모달창의 결과 result를 반환한다.
   */
  // close: (overlay?: string) => void
  close: () => void
  // /**
  //  * 모달 창을 그냥 닫으면서 부모창에 결과를 전달한다.
  //  */
  // apply: (closeArgs: { event: Event; item: any }) => void
}




declare interface ConfirmOption {
  yesText?: string
  noText?: string
}