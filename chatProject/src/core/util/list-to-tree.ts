// import _ from "lodash"

export function listToTree<T>(pList: T[], keyId: string, keyParent: string, keyChild = 'child'): T[] {
  const tree: T[] = []
  const tempById: any = {}
  
  // const list = _.cloneDeep(pList)
  
  const list = pList

  for (let i = 0, len = list.length; i < len; i++) {
    const item: any = list[i]
      // item.prev = list[i - 1]
      // item.next = list[i + 1]
    
    tempById[item[keyId]] = item
    if (!item[keyParent]) {
      item.lv = 1
    }
  }

  for (const id in tempById) {
    const temp = tempById[id]

    if (temp[keyParent]) {
      const prKey = temp[keyParent]
      // console.log('id = ', id, tempById[prKey]);
      if (!tempById[prKey][keyChild]) {
        tempById[prKey][keyChild] = []
        tempById[prKey].isCollapsed = true
      }
      temp.lv = tempById[prKey].lv + 1
      // temp.parent = tempById[prKey]
      temp.parentId = prKey
      tempById[prKey][keyChild].push(temp)
    } else {
      tree.push(temp)
    }
  }

  // console.log('list-to-tree', tree)

  return tree
}