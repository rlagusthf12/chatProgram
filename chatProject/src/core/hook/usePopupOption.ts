// import { PopupOption } from "@/core/typesPopup"
// import { ModalStyle } from "@/core/typesModal"

// export const popupOptionMap = new Map<string, PopupOption>()

// const defaultPopupStyle: ModalStyle = {
//   width: '80%',
//   maxWidth: '90%',
//   minWidth: '400px',

//   height: '80%',
//   maxHeight: '90%',
//   minHeight: '300px',

//   marginTop: '0px',
//   marginLeft: '0px',
// }

// const helpMsg = `popup option 작성법
// export const popupName = 'user-search-sample-popup'
// export const popupOption = usePopupOption(popupName, {
//   url: '/userSearchPopup/query',
//   codeVar: 'userId',
//   nameVar: 'userNm',
//   closeOnOverlay: false,
//   style: {
//     height: '80%',
//   }
// })
// `

// /**
//  * 팝업 프로그램마다 옵션을 설정하거나, 팝업의 옵션을 얻는다.
//  * 
//  * @param modalName string 팝업 프로그램의 kebab-case인 이름.
//  *                  `vm-popup`의 popup-name 또는 `vm-modal`의 modal-name 값
//  * @param option?  PopupOption 타입의 팝업 옵션. 옵션이 있으면 등록하고 없으면 옵션을 return 한다.
//  * 
//  */
// export function usePopupOption(modalName: string, option?: PopupOption): PopupOption {
//   if (!modalName) {
//     console.error(`usePopupOption() 파라미터 오류 popupName=${modalName}, addOption=${option}`)
//   } else if (!modalName.includes('-')) {
//     console.error(`usePopupOption() 파라미터 오류 popupName은 kebab-case로 작성하세요. popupName=${modalName}`)
//   }

//   if (option) {
//     // setter mode
//     // if (popupOptionMap.has(modalName)) {
//     //   throw `${modalName}은 이미 등록된 팝업 옵션 입니다.`
//     // }
//     option.style = Object.assign({}, defaultPopupStyle, option.style)
//     popupOptionMap.set(modalName, option)

//     return option

//   } else {
//     // getter mode
//     if (!popupOptionMap.has(modalName)) {
//       console.warn(helpMsg)
//       console.error(`usePopupOption() 등록 중 오류.${modalName} 을 찾을 수 없습니다.popupName은 kekab -case 입니다.`)
//     }
//     return popupOptionMap.get(modalName)!
//   }
// }