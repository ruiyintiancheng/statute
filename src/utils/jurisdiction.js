/*
 * @Author: lk
 * @Date: 2019-02-01 17:37:33
 * @Last Modified by:   lk
 * @Last Modified time: 2019-02-01 17:37:33
 */

import store from '@/store'

export function buttonJurisdiction(name) {
  return store.getters.buttonJurisdiction.find(function(value) { return value === name })
}
