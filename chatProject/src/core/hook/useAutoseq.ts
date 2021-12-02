import { http } from "@/core"
import { useAuth } from "./useAuth"

export async function useAutoseq(noCd: string, /* corpCd?: string | null, */ count: number = 1): Promise<any> {
  // if (!corpCd) {
  //   corpCd = useAuth().user.value?.corpCd
  // }
  const { data } =  await http.post('/autoseq/get', {
    corpCd: useAuth().user.value?.corpCd,
    noCd,
    count
  })

  console.log('useAutoseq response data =', data);
  return {
    ...data
  }
  
}