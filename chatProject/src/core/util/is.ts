// //https://github.com/vueuse/vueuse 
// export const isClient = typeof window !== 'undefined'
// export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
// export const assert = (condition: boolean, ...infos: any[]) => {
//   if (!condition) console.warn(...infos)
// }
// const toString = Object.prototype.toString
// export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
// export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
// export const isNumber = (val: any): val is number => typeof val === 'number'
// export const isString = (val: unknown): val is string => typeof val === 'string'
// export const isObject = (val: any): val is object =>
//   toString.call(val) === '[object Object]'
// export const isArray = (val: any): val is object =>
//   toString.call(val) === '[object Array]'
// export const isWindow = (val: any): val is Window =>
//   typeof window !== 'undefined' && toString.call(val) === '[object Window]'
// export const now = () => Date.now()
// export const timestamp = () => +Date.now()
// export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
// export const noop = () => { }


//https://github.com/vueuse/vueuse 
// const isClient = typeof window !== 'undefined'
// const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
// const assert = (condition: boolean, ...infos: any[]) => {
//   if (!condition) console.warn(...infos)
// }
const toString = Object.prototype.toString
const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
const isNumber = (val: any): val is number => typeof val === 'number'
const isString = (val: unknown): val is string => typeof val === 'string'
const isObject = (val: any): val is object =>
  toString.call(val) === '[object Object]'
const isArray = (val: any): val is object =>
  toString.call(val) === '[object Array]'
const isDate = (val: any): val is object =>
  toString.call(val) === '[object Date]'

// const isWindow = (val: any): val is Window =>
//   typeof window !== 'undefined' && toString.call(val) === '[object Window]'
// const now = () => Date.now()
// const timestamp = () => +Date.now()
// const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
// const noop = () => { }


export const is = {
  boolean: isBoolean,
  function: isFunction,
  number: isNumber,
  string: isString,
  object: isObject,
  array: isArray,
  date: isDate
}