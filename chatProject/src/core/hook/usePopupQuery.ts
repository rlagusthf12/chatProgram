import { Ref } from 'vue'
import { http } from "@/core"

/**
 * VmPopup과 VmGrid의 팝업 컬럼에서 이벤트가 발생하면 
 * 주어진 파라미터로 쿼리를 실행하고 조회결과 건수에따라
 * 값을 세팅하거나 두번째 파라미터 모달창을 띄운다.
 */
export async function usePopupQuery(param: PopupParam, vmModalRef?: Ref<VmModal>): Promise<PopupResult> {

  const { popupName, corpCd, code } = param
  const popupOption = {} as any //usePopupOption(popupName)
  const { codeVar = 'code', nameVar = 'name' } = popupOption

  const { data } = await http.post(popupOption.url!, {
    corpCd, code
  })
  let popupResult: PopupResult = {
    popupResultCount: 0,
    code: '',
    name: '',
    item: null
  }
  if (data) {
    popupResult.popupResultCount = data.length
    if (data.length == 1) {
      popupResult.code = code
      popupResult.name = data[0][nameVar]
      popupResult.item = data[0]
  
    } else if (data && data.length > 1) {
      // 여러건 조회는 명칭조회
      if (vmModalRef) {
        popupResult = await vmModalRef.value?.open({
          [nameVar]: code
        })
        console.log('[usePopupQuery]modal result 여러건 조회', vmModalRef, popupResult);
      }
    } 
  }
  console.log('[usePopupQuery] popup - 최종 popupResult=', popupResult)

  return popupResult
}
