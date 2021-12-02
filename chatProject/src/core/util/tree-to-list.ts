export function treeToList<T>(tree: Array<T>, keyChild = 'child'): T[] {
  const list = [] as (T & { [keyChild: string]: T[] })[]

  _ttl<T>(tree, keyChild, list)

  for (let i = 0; i < list.length; i++) {
    if (list[i][keyChild]) {
      delete list[i][keyChild]
    }
  }
  // console.log('tree-to-list', list)
  return list
}

function _ttl<T>(tree: Array<T>, keyChild: string, list: (T & { [keyChild: string]: T[] })[]): (T & { [keyChild: string]: T[] })[] {
  for (let i = 0, len = tree.length; i < len; i++) {
    const treeNode = tree[i] as T & { [keyChild: string]: T[] }

    if (treeNode[keyChild]) {
      list.push({ ...treeNode })
      _ttl(treeNode[keyChild], keyChild, list)
    } else {
      list.push({ ...treeNode })
    }
  }
  return list
}