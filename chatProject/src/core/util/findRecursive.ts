import { vmutil } from ".."

/**
 * 중첩된 형태의 arry, object에서 검색한다.
 */
export function findRecursive(findObject: object | Array<any>, findKey: string, findValue: string | number): any {
  let found: any
  // console.log('findObject instanceof Array', findObject instanceof Array, 'vmutil.is.object(findObject)', vmutil.is.object(findObject), findObject, findKey, findValue)
  if (findObject instanceof Array) {
    // found = findObject.find(findItem => {
    for (let i = 0; i < findObject.length; i++) {
      const findItem = findObject[i]
      // console.log('findItem instanceof Array', findItem instanceof Array, 'vmutil.is.object(findItem)', vmutil.is.object(findItem), findItem, findKey, findValue)
      if (findItem instanceof Array) {
        found = findRecursive(findItem, findKey, findValue)
        // if (found) return found
      } else if (vmutil.is.object(findItem)) {
        found = findInObject(findItem, findKey, findValue)
        // if ( found ) return found
        // for (let key in findItem) {
        //   let val = (<any>findItem)[key]
        //   if (val instanceof Array) {
        //     found = findRecursive(val, findKey, findValue)
        //     if (found) return found
        //   } else {
        //     if (key !== findKey) continue
        //     if (val === findValue) return findItem
        //   }
        // }
      }
      if (found) return found
    }
    // })
  } else if (vmutil.is.object(findObject)) {
    // console.log(typeof findObject, 'object')
    found = findInObject(findObject, findKey, findValue)
    if (found) return found
  }

  console.log('findRecursive return', found)
  // if ( found) debugger
  return found
}

function findInObject(findItem: object, findKey: string, findValue: string | number) {
  let found
  for (let key in findItem) {
    let val = (<any>findItem)[key]
    // console.log('findInObject ',findKey, key, findValue, val);

    if (val instanceof Array) {
      found = findRecursive(val, findKey, findValue)
      if (found) return found
    } else {
      if (key !== findKey) continue
      if (val === findValue) {
        // console.log(val);
        return findItem
      }
    }
  }

}