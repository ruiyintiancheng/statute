class Util {
  static deepMix(defultObj, newObj) {
    for (const i in newObj) {
      defultObj[i] = newObj[i]
    }
    return defultObj
  }

  static copyJson(json) {
    return JSON.parse(JSON.stringify(json))
  }

  static dateFormat(fmt, date) {
    let ret
    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
      }
    }
    return fmt
  }

  static stringToDate(dateStr) {
    // yyyyMMdd
    const format = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    return new Date(format)
  }
}

export default Util
