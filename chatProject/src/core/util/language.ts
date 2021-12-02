/**
 * txt에 따라 '은/는', '이/가' 등에 맞는 조사를 선택해준다.
 *
 * @param {*} txt 가나다라
 * @param {*} josa 은
 * @return 가나다라는
 */
export function josa(txt: string, josa: string) {
  var code = txt.charCodeAt(txt.length - 1) - 44032

  // 원본 문구가 없을때는 빈 문자열 반환
  if (txt.length == 0) return ''

  // 한글이 아닐때
  if (code < 0 || code > 11171) return txt

  if (code % 28 == 0) return txt + _getJosa(josa, false)
  else return txt + _getJosa(josa, true)
}

function _getJosa(josa: string, jong: boolean) {
  // jong : true면 받침있음, false면 받침없음
  if (josa == '을' || josa == '를') return (jong ? '을' : '를')
  if (josa == '이' || josa == '가') return (jong ? '이' : '가')
  if (josa == '은' || josa == '는') return (jong ? '은' : '는')
  if (josa == '와' || josa == '과') return (jong ? '와' : '과')

  // 알 수 없는 조사
  return '**'
}