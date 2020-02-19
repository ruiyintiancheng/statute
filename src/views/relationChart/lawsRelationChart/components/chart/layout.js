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
      .force('link', d3.forceLink().links(links).id(d => d.id).distance(100).strength(0.1)) // 弹力
      .force('charge', d3.forceManyBody().strength(-500)) // 多体力(万有引力)
      .force('collide', d3.forceCollide().radius(40)) // 碰撞力
      .stop()

    for (var i = 0; i < 300; ++i) { // 采用静态布局
      simulation.tick()
    }

    // 路径排版计算
    // {
    //   const map = new Map()

    //   links.forEach((d, i) => {
    //     // d.id = `path-${i}`;
    //     d.path = d.source.id + '-' + d.target.id
    //     d.unpath = d.target.id + '-' + d.source.id
    //     d.num = 1

    //     if (map.has(d.path)) {
    //       d.num = map.get(d.path) + 1
    //     }
    //     map.set(d.path, d.num)
    //   })

    //   const dq = 25 // 根据字体高度浮动
    //   const q = dq * 2

    //   links.forEach(d => {
    //     if (map.has(d.unpath)) { // 两点间存在反向路径
    //       d.v = 0
    //       d.q = d.num * q - dq
    //     } else {
    //       if (map.get(d.path) % 2 === 0) { // 偶数条路径
    //         d.num += 1
    //         d.q = parseInt(d.num / 2) * q - dq
    //       } else { // 奇数条路径
    //         d.q = parseInt(d.num / 2) * q
    //       }
    //       d.v = d.num % 2 === 0 ? -1 : 1
    //     }
    //     d.color = 'red'
    //   })
    // }
  }
}

function before(data) {
  data.nodes.forEach(d => {
    d.x = Math.random() * 1960
    d.y = Math.random() * 1080
  })
}
export default Layout
