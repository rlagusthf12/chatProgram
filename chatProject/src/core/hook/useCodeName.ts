import { http } from "@/core"

export async function useCodeName<T>(condData: any): Promise<T> {
  const res = await http.get('/codeName/query', condData)
  return res?.data
  // return new Promise((resolve, reject) => {
  //   const tests: any = {
  //     'SYS009': [
  //       { code: 0, name: 'N' },
  //       { code: 1, name: 'Y' },
  //     ],
  //     'FIM038': [
  //       { code: 'x', name: '가가가' },
  //       { code: 'y', name: '나나나' },
  //       { code: 'z', name: '다다다' },
  //     ],
  //     'SYS003': [
  //       { code: 'a', name: 'AAA' },
  //       { code: 'b', name: 'BBB' },
  //       { code: 'c', name: 'CCC' },
  //     ]
  //   }

  //   resolve(tests[condData.code])
  // })
}