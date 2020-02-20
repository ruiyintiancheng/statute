import * as d3 from 'd3'
// import { Nodes } from './shape.js'
import { Nodes, Links } from './shape.js'

const Rander = {
  /**
   * 绘制图形
   * @param {*} cfg
   */
  draw(cfg) {
    this._cfg = cfg
    const g = cfg.g
    const nodes = cfg.data.nodes
    const links = cfg.data.links
    const nodeg = g.selectAll('g.node').data(nodes, d => d.id)
    // add Node
    nodeg.enter().each(function(d, i) {
      Nodes['default'].enter(d3.select(this), d, i)
    })
    // update Node
    nodeg.each(function(d) {
      Nodes['default'].update(d3.select(this), d)
    })
    // exit Node
    nodeg.exit().each(function(d) {
      Nodes['default'].exit(d3.select(this), d)
    })

    const linkg = g.selectAll('g.link').data(links, d => `${d.source.id}-${d.target.id}`)
    // // add Link
    linkg.enter().each(function(d) {
      Links['default'].enter(d3.select(this), d)
    })
    // update Link
    linkg.each(function(d) {
      Links['default'].update(d3.select(this), d)
    })
    // exit Link
    linkg.exit().each(function(d) {
      Links['default'].exit(d3.select(this), d)
    })

    this.tick()
  },
  /**
   * 更新图形
   */
  tick() {
    const g = this._cfg.g
    const linkg = g.selectAll('g.link')
    linkg.select('path')
      .attr('d', d => path(d))
    linkg.select('text')
      .attr('rotate', d => rotate(d))
      .select('textPath')
      .text(d => pathText(d))

    g.selectAll('g.node').attr('transform', d => `translate(${d.x}, ${d.y})`)
  }
}

function path(d) {
  const x1 = d.source.x
  const y1 = d.source.y // 起始点坐标
  const x2 = d.target.x
  const y2 = d.target.y // 终止点坐标
  return `M ${x1},${y1} L ${x2},${y2}`
}
// 路径文字旋转
function rotate(d) {
  const x1 = d.source.x
  const x2 = d.target.x
  return x1 > x2 ? 180 : 0
}
// 路径文字
function pathText(d) {
//   let text = d.properties.role;
  let text = d.name + ' -- ' + d.id

  if (text === undefined || text === null) {
    text = ''
  }
  const x1 = d.source.x
  const x2 = d.target.x

  if (x1 > x2) {
    return text.split('').reverse().join('')
  } else {
    return text
  }
}

export default Rander
