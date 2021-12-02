import { http, storage } from '@/core'
import { computed, ref } from 'vue'

export enum AuthKey {
  JWT = 'jwtSmart',
  LOGIN_USER = 'loginUser'
}


const user = ref<User | null>(null)
const isLogin = computed(() => {
  return user.value !== null
})

async function login(loginParam: LoginParam) {
  if (!loginParam.userId || !loginParam.passTxt) {
    alert('아이디와 비밀번호를 입력하세요.')
    return
  }

  storage.remove(AuthKey.JWT)
  const response = await http.response('/user/login', loginParam)
  if (response.headers.authorization) {
    user.value = response.data
    storage.set(AuthKey.JWT, response.headers.authorization, true)
  }
}

async function logout() {
  await http.get('/user/logout')
  user.value = null
  storage.remove(AuthKey.JWT)
}

async function loginCheck(): Promise<void> {
  try {
    const response = await http.response<User>('/user/getLoginData')
    if (response.headers.authorization) {
      user.value = response.data
      storage.set(AuthKey.JWT, response.headers.authorization, true)
      return Promise.resolve()
    }
  } catch (e) {
    // alert('서버에 접속 할 수 없습니다.')
    throw '로그인 검사 예외 사항 처리 필요함'
    // const testUser: User = { "codeCol": null, "code": null, "nameCol": null, "name": null, "insertUserId": null, "insertDatetime": null, "updateUserId": null, "updateDatetime": null, "_si_": null, "_tr_": null, "userId": "smart", "corpCd": "DEV-ADMIN", "userNm": "스마트", "userTp": null, "empNo": null, "telNo": null, "inlineNo": null, "emailId": "smarterpvmc@gmail.com", "passTxt": null, "passChgDt": null, "passErrCnt": null, "langCd": null, "userPcIp": null, "bizplcCd": null, "uoaCd": null, "useFrDt": null, "useToDt": null, "splyDtm": null, "cancelDtm": null, "statFg": null, "remarkTxt": null, "userTpNm": null, "empNm": null, "deptCd": null, "ccCd": null, "ccNm": null, "deptNm": null, "bizplcNm": null, "pwcycUseYn": null, "pwcycQty": 0, "pwerrUseYn": null, "pwerrQty": 0, "useripChkYn": null, "loginRcdYn": null, "pgmuseRcdYn": null, "forUseYn": null }
    // user.value = testUser
    // storage.set(AuthKey.JWT, 'no-server-key', true)
    // return Promise.resolve()
    // const err = e as AxiosResponse
    // if (err?.response?.data?.code?.includes('jwt')) {
    //   if (storage.get(AuthKey.JWT) !== undefined) {
    //     storage.remove(AuthKey.JWT)
    //   }
    // }
  }
}

/**
 * 인증 정보 관리
 로그인한 사용자 정보는 useAuth().user 또는 const vm = useVm()이후 vm.user로 접근
 */
export function useAuth(): Auth {
  return {
    user,
    isLogin,
    loginCheck,
    login,
    logout,
  }
}