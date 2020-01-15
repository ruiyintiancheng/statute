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
    nodeg.enter().each(function(d) {
      Nodes['default'].enter(d3.select(this), d)
    })
    // update Node
    nodeg.each(function(d) {
      Nodes['default'].update(d3.select(this), d)
    })
    // exit Node
    nodeg.exit().each(function(d) {
      Nodes['default'].exit(d3.select(this), d)
    })

    const linkg = g.selectAll('g.link').data(links, d => d.id)
    // add Link
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
// 二次贝塞尔曲线
// function path(d) {
//   const x1 = d.source.x
//   const y1 = d.source.y // 起始点坐标
//   const x2 = d.target.x
//   const y2 = d.target.y // 终止点坐标

//   const q = d.q // 曲线间距
//   let v = d.v // 方向
//   // v === 0 表示自适应布局 1 逆时针旋转 -1 顺时针旋转
//   v = (v === undefined || v === null || v === 0) ? (x1 > x2 ? -1 : 1) : v

//   const radian = Math.atan((y2 - y1) / (x2 - x1))
//   // 曲线点坐标
//   const x = (x1 + x2) / 2 - v * q * Math.sin(radian)
//   const y = (y1 + y2) / 2 + v * q * Math.cos(radian)

//   // const r1 = d.source.r
//   // const radian1 = getRadian(x1, y1, x, y)
//   // const r2 = d.target.r
//   // const radian2 = getRadian(x2, y2, x, y)

//   // x1 = x1 + r1 * Math.cos(radian1)
//   // y1 = y1 + r1 * Math.sin(radian1)
//   // x2 = x2 + r2 * Math.cos(radian2)
//   // y2 = y2 + r2 * Math.sin(radian2)

//   // 计算弧度
//   // function getRadian(x1, y1, x2, y2) {
//   //   let radian1 = Math.atan((y2 - y1) / (x2 - x1))
//   //   if (x1 < x2) {
//   //     if (y1 > y2) {
//   //       radian1 = Math.PI * 2 + radian1
//   //     }
//   //   } else {
//   //     radian1 = Math.PI + radian1
//   //   }
//   //   return radian1
//   // }
//   return `M ${x1},${y1} L ${x2},${y2}`
//   // return `M ${x1},${y1} Q ${x},${y} ${x2},${y2}`
// }
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
