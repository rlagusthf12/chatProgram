import { vmutil } from "@/core"

/**
 * 필수입력 검사
 * @param item 필수입력 검사할 항목
 * @param msg 미입력시 
 * @param fn 미입력시 vm.alert 대신 실행할 함수
 */
function requireCheck(checkValue: string | number, valueName: string, fn?:Function) {
  if (!checkValue) {
    if (fn) {
      fn(vmutil.josa(valueName, '를') + ' 입력하세요.')
      return false
    } else {
      return false
      // throw vmutils.josa(valueName, '를') + ' 입력하세요.'
    }
    // alert(josa(msg, '를') + ' 입력하세요.')
    // throw '필수입력 누락'
  }
  return true
}

const password_special = '`~!@#$%^&*()-_+=[]{}\|;:\'",.<>/?'
/**
 * <pre>
 * 비밀번호 8자리 이상
 * 숫자 포함
 * 영대 문자 포함
 * 영소 문자 포함
 * 특수문자 포함
 * 공백 X
 * 같은 문자 4번 반복 X
 * 아이디 포함 X
 * 한글 X
 * </pre>
 */
function passwordRule(passTxt: string, id: string, fn?: Function) {
  // const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-`]).{8,}$/
  const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[`~!@#$%^&*\(\)-_=+\{\}\[\];:'",./<>?\\|]).{8,30}$/
  const hangulcheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
  let msg = ''

  if (false === reg.test(passTxt)) {
    msg = '비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.'
  } else if (/(\w)\1\1\1/.test(passTxt)) {
    msg = '같은 문자를 4번 이상 사용하실 수 없습니다.'
  } else if (passTxt.search(id) > -1) {
    msg = '비밀번호에 아이디가 포함되었습니다.'
  } else if (passTxt.search(/\s/) != -1) {
    msg = '비밀번호는 공백 없이 입력해주세요.'
    return false
  } else if (hangulcheck.test(passTxt)) {
    msg = '비밀번호에 한글을 사용 할 수 없습니다.'
  }
  // else {
  //   return msg
  // }
  if (msg && fn) {
    fn(msg)
    // return false
  } // else throw '비밀번호 규칙을 만족하지 않습니다.'
  return msg
}

function telNoRule(telNo: string) {
  if (!telNo) {
    return true
  } else if (telNo.startsWith('01')) {
    // 0101231234
    return telNo.length >= 10 
  } else {
    // 021231234
    return telNo.length >= 9
  }
}

export const validators = {
  requireCheck,
  passwordRule,
  telNoRule
}