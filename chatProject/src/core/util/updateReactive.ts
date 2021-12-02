export function updateReactive(src: any, dst: any) {
  for (let k in src) {
    src[k] = undefined
  }
  Object.assign(src, dst)
  // console.log(src, dst);
}