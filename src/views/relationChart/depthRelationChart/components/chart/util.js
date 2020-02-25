import saveSvg from 'save-svg-as-png'

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

  static savePng(cfg, title) {
    title = title || '图谱'
    const padding = 50

    var svg = cfg.svg
    const bg = cfg.g.node().getBBox()
    const width = bg.width + 2 * padding
    const height = bg.height + 2 * padding

    const csvg = svg.clone(true)
    csvg.select('g.group').attr('transform', `translate(${padding - bg.x}, ${padding - bg.y})scale(1)`)
    csvg.remove()
    saveSvg.saveSvgAsPng(csvg.node(), `${title}.png`, { height: height, width: width })
  }

  // static savePng(cfg, title) {
  //   title = title || '图谱'
  //   const padding = 50

  //   var svg = cfg.svg
  //   const bg = cfg.g.node().getBBox()
  //   const csvg = svg.clone(true)
  //   csvg.select('g.group').attr('transform', `translate(${padding - bg.x}, ${padding - bg.y})scale(1)`)

  //   var serializer = new XMLSerializer()
  //   var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(csvg.node())

  //   csvg.remove()

  //   var image = new Image()
  //   image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

  //   var canvas = document.createElement('canvas')
  //   canvas.width = bg.width + 2 * padding
  //   canvas.height = bg.height + 2 * padding

  //   var context = canvas.getContext('2d')
  //   context.fillStyle = '#fff'// #fff设置保存后的PNG 是白色的
  //   context.fillRect(0, 0, 10000, 10000)

  //   image.onload = function() {
  //     context.drawImage(image, 0, 0)
  //     var a = document.createElement('a')
  //     a.download = `${title}.png`
  //     a.href = canvas.toDataURL('image/png')
  //     a.click()
  //   }
  // }
}

export default Util
