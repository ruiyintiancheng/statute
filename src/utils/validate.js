/*
 * @Author: lk
 * @Date: 2019-02-01 17:37:56
 * @Last Modified by: lk
 * @Last Modified time: 2020-02-20 11:37:05
 */
import * as validators from './validators'
import { baseRequest } from '@/api/base'
import { getPublicKey } from './encryption'
import { encryptByPublicKey } from './encryption'

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 手机号*/
export function validatePhoneNum(str) {
  return /^1[34578]\d{9}$/.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

// v2
// const length = value.length
// let boo = true
// if (obj.params[1]) {
//   boo = length >= Number.parseInt(obj.params[0]) && length <= Number.parseInt(obj.params[1])
// } else if (obj.param[0]) {
//   boo = length <= Number.parseInt(obj.params[0])
// }

/**
 * 获取验证方式
 */
function getValidateObj(key, obj) {
  const validator = (rule, value, callback) => {
    if (!validators[key]) {
      callback()
    } else {
      if (!validators[key](value, obj)) {
        callback(new Error(obj.msg))
      } else {
        callback()
      }
    }
  }
  return validator
}

/**
 * 表单参数校验
 * @param {验证器id} key
 * @param {验证参数及错误信息} obj
 */
export function getValidate(key, obj) {
  let objValidate = {}
  if (key === 'V1') {
    objValidate = { required: true, message: obj.msg }
  } else {
    objValidate = { validator: getValidateObj(key, obj) }
  }
  return objValidate
}

/**
 * 对请求参数的验证
 * @param {参数} map
 */
export function validateParams2(map) {
  const params = {}
  for (const key in map) {
    if (map[key] && typeof map[key] === 'object' && map[key].constructor !== Array) {
      const paramConvertMap = {}
      for (const key2 in map[key]) {
        if (typeof map[key][key2] === 'object') {
          paramConvertMap[key2] = map[key][key2]
        } else {
          let param = map[key][key2] + ''
          param = param.replace(/(^\s*)|(\s*$)/g, '')
          if (param !== '' && param !== 'null') {
            paramConvertMap[key2] = param
          }
        }
      }
      params[key] = paramConvertMap
    } else {
      let param = map[key] + ''
      param = param.replace(/(^\s*)|(\s*$)/g, '')
      if (param !== '' && param !== 'null') {
        params[key] = param
      }
    }
  }
  return params
}

export function validateParams(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = validateParams(source[keys])
    } else {
      if (source[keys] !== null) {
        const temp = (source[keys] + '').replace(/(^\s*)|(\s*$)/g, '')
        if (temp !== '') {
          targetObj[keys] = temp
        }
      }
    }
  })
  return targetObj
}

export function saveUpdate(url, formValue, rules, form, keys) {
  if (!rules.addBackValidate) {
    for (const key in formValue) {
      if (!rules.hasOwnProperty(key)) {
        rules[key] = []
      }
      rules[key].push({ validator: (rule, value, callback) => {
        if (rules[key + 'errorMsg'] && rules[key + 'errorMsg'][0]) {
          callback(new Error(rules[key + 'errorMsg'][0]))
        } else {
          callback()
        }
      }
      })
    }
    rules.addBackValidate = [true]
  }
  return new Promise((resolve, reject) => {
    form.validate((valid) => {
      if (valid) {
        if (keys) {
          getPublicKey().then(param => {
            const newForm = {}
            for (const key in formValue) {
              if (keys.find(val => val === key)) {
                newForm[key] = encryptByPublicKey(formValue[key], param)
              } else {
                newForm[key] = formValue[key]
              }
            }
            sendUpdateUrl(url, newForm, rules, form).then(response => { resolve(response) }, _ => reject())
          })
        } else {
          sendUpdateUrl(url, formValue, rules, form).then(response => { resolve(response) }, _ => reject())
        }
      } else {
        reject()
      }
    })
  })
}
function sendUpdateUrl(url, formValue, rules, form) {
  return new Promise((resolve, reject) => {
    baseRequest(url, formValue).then((response) => {
      if (response.code === 2) {
        const validateMsg = response.data.validateMsg
        for (const key in validateMsg) {
          if (rules.hasOwnProperty(key)) {
            rules[key + 'errorMsg'] = [validateMsg[key]]
            form.validateField(key)
            rules[key + 'errorMsg'] = null
          }
        }
        reject()
      } else {
        resolve(response)
      }
    })
  })
}
