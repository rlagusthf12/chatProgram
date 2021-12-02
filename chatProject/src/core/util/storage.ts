// console.log('storage -------------------------------------------');

/**
 * localStorage 또는 sessionStorage에서 값을 얻는다.
 * 주어진 key로 sessionStorage에서 먼저 찾고 없으면(null, undefined) localStorage에서 찾는다. 
 * @param key storage에 저장된 키
 */
function get<T extends string | string[] | boolean>(key: string): T | null {
  try {
    // const value = (isSession ? sessionStorage : localStorage).getItem(key)
    let value = sessionStorage.getItem(key) ?? localStorage.getItem(key)

    if (value) {
      if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']'))) {
        return JSON.parse(value) as T
      }
      
      if (value === 'true') {
        return true as T
      } else if (value === 'false') {
        return false as T
      } else {
        return value as T
      }

    }
    return null
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('스토리지에서 가져올때 에러. key=', key, e)
    }
    return null
  }
}

/**
 * localStorage 또는 sessionStorage에 저장 한다.
 * @param key storage에 저장할 key
 * @param value storage에 저장할 value. object이면 json으로 저장, 그외는 string으로 변환
 * @param isSession sessionStorage에 저장할지 여부. 기본값 false
 */
function set<T>(key: string, value: T, isSession?: boolean): void {
  let strValue
  if (typeof value === 'object') {
    strValue = JSON.stringify(value)
  } else {
    strValue = String(value)
  }
  ; (isSession ? sessionStorage : localStorage).setItem(key, strValue)
}

/**
 * storage에서 제거한다.
 */
function remove(key: string): void {
  sessionStorage.removeItem(key)
  localStorage.removeItem(key)
}

export const storage = {
  get, set, remove
}


// console.log('------------------------------------------- storage ')