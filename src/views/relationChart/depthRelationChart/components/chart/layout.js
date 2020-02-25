import * as d3 from 'd3'
class Layout {
  static setConfig(cfg) {
    this.width = cfg.width
    this.height = cfg.height
  }

  static init(data) {
    const nodes = data.nodes
    const links = data.links
    if (nodes.length === 0) {
      return
    }
    before(data)
    const simulation = d3.forceSimulation(nodes) // 力布局
      .force('center', d3.forceCenter(this.width / 2, this.height / 2)) // 定心力
      .force('link', d3.forceLink().links(links).id(d => d.id).distance(150).strength(0.1)) // 弹力
      .force('charge', d3.forceManyBody().strength(-100)) // 多体力(万有引力)
      .force('collide', d3.forceCollide().radius(80)) // 碰撞力
      .stop()

    for (var i = 0; i < 300; ++i) { // 采用静态布局
      simulation.tick()
    }
  }
}

function before(data) {
  data.nodes.forEach(d => {
    d.x = Math.random() * 1960
    // d.y = Math.random() * 1080
    d.y = d.fy = d.orgRank * 200
  })
}
export default Layout
