// import * as d3 from 'd3'
class Layout {
  static setConfig(cfg) {
    this.width = cfg.width
    this.height = cfg.height
    this.cfg = cfg
  }

  static init(data) {
    const nodes = data
    if (nodes.length === 0) {
      return
    }
    // before(data)
    const nodeMap = new Map()

    nodes.forEach(d => {
      let key = ''
      if (this.cfg.dataType === 'year') {
        key = d.year + '##'
      } else {
        key = d.year + '##' + d.month
      }

      if (nodeMap.has(key)) {
        nodeMap.get(key).data.push(d)
      } else {
        const node = {
          year: d.year,
          month: d.month,
          color: getColor(d.timeType),
          data: [d]
        }
        nodeMap.set(key, node)
      }
    })

    const array = []
    nodeMap.forEach(value => {
      array.push(value)
    })
    this.cfg.data = array

    getRange(this.cfg)
  }
}

function getRange(cfg) {
  const data = cfg.data
  const yearRange = [data[0].year, data[0].year]
  const countRange = [data[0].data.length, data[0].data.length]

  data.forEach(d => {
    const year = d.year
    const count = d.data.length

    if (year < yearRange[0]) {
      yearRange[0] = year
    }

    if (year > yearRange[1]) {
      yearRange[1] = year
    }

    if (count < countRange[0]) {
      countRange[0] = count
    }

    if (count > countRange[1]) {
      countRange[1] = count
    }
  })
  cfg.yearRange = yearRange
  cfg.countRange = countRange
}

function getColor(type) {
  let color = 'gray'
  switch (type) {
    case 1:
      color = '#9EEA6A'
      break
    case 2:
      color = '#4fbaf4'
      break
    case 3:
      color = '#ff804c'
      break
    case 4:
      color = 'red'
      break
  }
  return color
}
export default Layout
