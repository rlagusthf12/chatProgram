import { toRaw, unref } from '@vue/reactivity'
import axios, { AxiosRequestConfig } from 'axios'
import { AuthKey, storage, useAuth, blockOff, blockOn } from '@/core'

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL as string

const _axios = axios.create({
  baseURL: baseUrl,
})

_axios.interceptors.request.use(
  function onFulfilled(config) {
    blockOn()
    const jwt = storage.get<string>(AuthKey.JWT)
    if (jwt) {
      config.headers.Authorization = 'Bearer ' + jwt
    }
    const token = storage.get<string>('token')
    config.headers.token = token
    return config
  },
  function onRejected(error) {
    blockOff()
    console.error('axios request error =>>', error)
    return Promise.reject(error)
  }
)
// TODO: 서버 접속 안될때처리
_axios.interceptors.response.use(
  function onFulfilled(response) {
    blockOff()
    return response
  },
  function onRejected(e) {
    blockOff()
    const msg = e?.response?.data?.message
    console.error(e)
    if ( e.response.data.code === 'jwt error') {
      storage.remove(AuthKey.JWT)
    }
    if (msg.includes('오류가 발생')) {
      alert(msg)
    } else {
      alert(msg || e)
    }
    return Promise.reject(e)
  }
)
// const SERVER_ERROR_MESSAGE = '서버에서 오류가 발생하였습니다. 관리자에게 문의 하여 주시기 바랍니다.'
// async function get<T extends ServerResponseData>(url: string, data?: any): T {
async function get<T = any>(url: string, data?: any): Promise<T> {
  blockOn()
  try {
    const plainData = toRaw(unref(data)) || {}
    if (plainData) {
      plainData.corpCd = plainData.corpCd || useAuth()?.user?.value?.corpCd
      url += '?' + Object.keys(plainData).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(plainData[k])
      }).join('&')
    }
    const response = await _axios.get<{
      data: T,
      result: string,
      [key: string]: any
    }>(url)
    return response.data as any as T
    // return Promise.resolve(response.data)
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  } finally {
    blockOff()
  }
}

async function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
  blockOn()
  try {
    const plainData = toRaw(unref(data)) || {}
    // if (plainData) {
    //   plainData.corpCd = plainData.corpCd || useAuth()?.user?.value?.corpCd
    // }
    const response = await _axios.post<{
      data: T,
      result: string,
      [key: string]: any
    }>(url, plainData, config)
    // console.log('HTTP post url, condData, resultData', url, plainData, response.data)
    return response.data //as any as T
  } catch (e) {
    return Promise.reject(e)
  } finally {
    blockOff()
  }
}

async function response<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
  blockOn()
  try {
    const plainData = toRaw(unref(data))
    // if (plainData) {
    //   plainData.corpCd = plainData.corpCd || useAuth()?.user?.value?.corpCd
    // }
    // console.log('HTTP response url, data =', url, plainData)
    const response = await _axios.post<T>(url, plainData, config)
    return response
  } catch (e) {
    return Promise.reject({})
} finally {
  blockOff()
}
}

// async function upload(url: string, data: any, fileList?: File[] | FileList | null, config?: AxiosRequestConfig) {
async function upload(url: string, saveData: any, uploadSaveData?: UploadSaveData, config?: AxiosRequestConfig) {
  try {
    const plainData = toRaw(unref(saveData)) || {}
    // if (plainData) {
    //   plainData.corpCd = plainData.corpCd || useAuth()?.user?.value?.corpCd
    // }
    const formData = new FormData()
    if (uploadSaveData) {
      const uploadData = {
        addFileData : uploadSaveData.addFileData,
        removeFileData : uploadSaveData.removeFileData
      }
      formData.append('uploadData', new Blob([JSON.stringify(uploadData)], { type: "application/json" }))
      // plainData.addFileData = uploadSaveData.addFileData
      // plainData.removeFileData = uploadSaveData.removeFileData
      const fileList = uploadSaveData.files
      for (let i = 0; i < fileList.length ; i++) {
        formData.append('files', fileList[i])
      }
    }
    formData.append('data', new Blob([JSON.stringify(plainData)], { type: "application/json" }))

    console.log('upload', formData, plainData, uploadSaveData);
    
    const response = await _axios.post<{
      data: any,
      result: string,
      [key: string]: any
    }>(url, formData, {
      ...config,
      headers: {
        contentType: 'multipart/form-data'
      }
    })
    // console.log('HTTP post url, condData, resultData', url, plainData, response.data)
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}

const http = {
  get,
  post,
  response,
  upload
}

export default http