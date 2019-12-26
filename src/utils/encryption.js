/*
 * @Author: lk
 * @Date: 2019-03-11 15:47:27
 * @Last Modified by: lk
 * @Last Modified time: 2019-04-12 13:47:41
 * @Description:  加密
 */
import { JSEncrypt } from 'jsencrypt'
import { baseRequest } from '@/api/base'

/**
 * 加密 单个字段
 * @param {密码} key
 */
export function encrypt(key) {
  return new Promise((resolve, reject) => {
    baseRequest('/login/loginFirstSecret').then(response => {
      // 加密：要测试的明文数据
      const str = `${key}|${response.data.item.rand}`
      const publicKey = response.data.item.publicKey // 从后台获取公钥，这里省略，直接赋值
      const encryptor = new JSEncrypt() // 新建JSEncrypt对象
      encryptor.setPublicKey(publicKey) // 设置公钥
      const password = encryptor.encrypt(str) // 对密码进行加密
      resolve(password)
    })
  })
}

/**
 * 加密 多个字段
 * @param {密码} key
 */
export function encrypts(obj) {
  return new Promise((resolve, reject) => {
    baseRequest('/login/loginFirstSecret').then(response => {
      const newObj = {}
      // 加密：要测试的明文数据
      const publicKey = response.data.item.publicKey // 从后台获取公钥，这里省略，直接赋值
      for (const key in obj) {
        const str = `${key}|${response.data.item.rand}`
        const encryptor = new JSEncrypt() // 新建JSEncrypt对象
        encryptor.setPublicKey(publicKey) // 设置公钥
        newObj[key] = encryptor.encrypt(str) // 对密码进行加密
      }
      resolve(newObj)
    })
  })
}

/**
 * 获取公钥和随机数
 */
export function getPublicKey() {
  return new Promise((resolve, reject) => {
    baseRequest('/login/loginFirstSecret').then(response => {
      resolve(response.data.item)
    })
  })
}

/**
 * 加密 根据公钥
 */
export function encryptByPublicKey(key, param) {
  // 加密：要测试的明文数据
  const str = `${key}|${param.rand}`
  const publicKey = param.publicKey // 从后台获取公钥，这里省略，直接赋值
  const encryptor = new JSEncrypt() // 新建JSEncrypt对象
  encryptor.setPublicKey(publicKey) // 设置公钥
  const password = encryptor.encrypt(str) // 对密码进行加密
  return password
}
