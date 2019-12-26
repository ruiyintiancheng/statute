/*
 * @Author: lk
 * @Date: 2019-02-01 17:38:04
 * @Last Modified by: lk
 * @Last Modified time: 2019-04-09 12:57:09
 */
/* 最大长度*/
export function V2(value, obj) {
  if (!value) return true
  const params = obj.params
  if (!params[0] || !Number.isInteger(Number.parseInt(params[0]))) return true
  return value.length <= Number.parseInt(params[0])
}

/* 最大字节*/
export function V3(value, obj) {
  if (!value) return true
  const params = obj.params
  if (!params[0] || !Number.isInteger(Number.parseInt(params[0]))) return true
  let bytesCount = 0
  for (var i = 0; i < value.length; i++) {
    var c = value.charAt(i)
    if (/^[\u0000-\u00ff]$/.test(c)) {
      bytesCount += 1
    } else {
      bytesCount += 2
    }
  }
  return bytesCount <= Number.parseInt(params[0])
}

/* 整数验证*/
export function V4(value) {
  if (!value) return true
  return /^\d+$/.test(value)
}

/* 数字验证*/
export function number(value) {
  if (!value) return true
  return /^[0-9]*\.?[0-9]+$/.test(value)
}

/* 小数验证*/
export function V5(value, obj) {
  if (!value) return true
  return /^[0-9]+\.[0-9]+$/.test(value)
}

/** 正则验证 */
export function V8(value, obj) {
  if (!value) return true
  const params = obj.params
  if (!params[0]) return true
  const reg = new RegExp(params[0])
  return reg.test(value)
}

// function notExsit(value) {
//   return value === null || value === undefined || value === ''
// }

