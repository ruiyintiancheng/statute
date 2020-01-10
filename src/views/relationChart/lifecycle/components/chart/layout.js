// import * as d3 from 'd3'
class Layout {
  static setConfig(cfg) {
    this.width = cfg.width
    this.height = cfg.height
    this.cfg = cfg
  }

  static init(data) {
    const nodes = []
    const links = []

    for (let i = 0; i < data.length; ++i) {
      const node = data[i]
      node.x = i * 300
      node.y = 0
      nodes.push(node)

      if (i > 0) {
        links.push({
          source: nodes[i - 1],
          target: nodes[i]
        })
      }
    }

    this.cfg.data = { nodes, links }
  }
}

export default Layout
