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
      const key = d.year + '##' + d.month
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
  }
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
