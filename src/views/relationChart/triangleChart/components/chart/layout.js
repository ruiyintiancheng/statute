// import * as d3 from 'd3'
class Layout {
  static setConfig(cfg) {
    this.width = cfg.width
    this.height = cfg.height
    this.cfg = cfg
  }

  static init(data) {
    const padding = 10
    const depth = 100 // (this.height - 20) / data.length - 10

    const nodes = []

    for (let i = 0; i < data.length; ++i) {
      const len = data[i].length
      const h = (depth + padding) * i + depth
      const w = 2 * h / len
      for (let j = 0; j < len; ++j) {
        const node = data[i][j]
        // x坐标
        node.x = -h + w * j
        // y坐标
        node.y = h - depth
        // 所占宽度
        node.width = w
        // 所占高度
        node.height = depth
        // 形状
        node.polygon = getPolygon(node)
        // 所在层级
        node.depth = i
        // 位置
        node.index = j
        // 层级长度
        node.len = len
        nodes.push(node)
      }
    }
    this.cfg.maxDepth =
    this.cfg.data = nodes
  }
}

function getPolygon(d) {
  // 顶部
  const x = d.x
  const y = d.y
  const width = d.width
  const height = d.height

  let polygon = `0,${height}`

  // 第一控制带点
  const x1 = Math.abs(x)
  if (x1 >= y) {
    polygon += ` 0,${x1 - y}`
  } else {
    polygon += ` 0,0`
  }

  // 第二控制点
  const x2 = -y
  if (x < x2 && x + width > x2) {
    polygon += ` ${x1 - y},0`
  }

  // 第三控制点
  const x3 = y
  if (x < x3 && x + width > x3) {
    polygon += ` ${y - x},0`
  }

  // 第四控制点
  const x4 = Math.abs(x + width)
  if (x4 >= y) {
    polygon += ` ${width},${x4 - y}`
  } else {
    polygon += ` ${width},0`
  }

  polygon += ` ${width},${height}`

  return polygon
}

export default Layout
