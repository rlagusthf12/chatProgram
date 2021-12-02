declare interface LoginParam {
  corpCd: string
  userId: string
  passTxt: string
}

interface User {
  corpCd: string// | null
  userId: string// | null
  userNm: string// | null
  corpEnm?: string | null
  corpNm?: string | null
  deptCd?: string | null
  deptNm?: string | null
  empNm?: string | null
  empNo?: string | null
  bizplcCd?: string | null
  bizplcNm?: string | null
  ccCd?: string | null
  ccNm?: string | null
  userTpNm?: string | null
  initTp?: string | null
  initUrl?: string | null
  userTp?: string | null
  tempPasswordState?: string
  [index: string]: any
}

// declare interface SysUser {
//   userId: string
//   corpCd: string
//   userNm: string
//   userTp: string
//   empNo: string
//   bizplcCd: string
//   userTpNm: string
// }
// declare interface LoginUser extends User {
//   ccCd?: string
//   ccNm?: string
  
// }

declare interface Auth {
  user: import('vue').Ref<User | null>
  isLogin: import('vue').ComputedRef<boolean>
  loginCheck(): Promise<any>
  login(loginData: LoginParam): void
  logout(): void
}



