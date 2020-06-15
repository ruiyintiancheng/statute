import * as d3 from 'd3'

// 图例数据
const data = {
  nodes: [
    { name: '近3年发布的政策', color: '#6ACC85' },
    { name: '3-5年未修订', color: '#1A93FA' },
    { name: '5-10年未修订', color: '#FBAD29' },
    { name: '10年以上未修订', color: '#F46B7B' }
  ],
  links: [
    { name: '浅颜色新任务', color: '#6ACC85' },
    { name: '深颜色其它', color: '#5FAD63' }
  ]
}
/** 绘制图例 */
//  {
//    container: '#legend',
//    width: 1000,
//    height: 30
//  }
export function legends(cfg) {
  // 图例容器
  const container = cfg.container
  // 宽度
  const width = cfg.width || 1000
  // 高度
  const height = cfg.height || 30
  // 背景颜色
  const background = cfg.background || '#ffffff'
  const g = d3.select(container)
    .style('width', width + 'px')
    .style('height', height + 'px')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('margin-bottom', '-3px')
    .style('background-color', background)
    .append('g')
    .style('font-size', '14px')

  // add Node
  const nodeg = g.selectAll('g.node').data(data.nodes).enter()
    .append('g')
    .classed('node', true)

  nodeg.append('circle')
    .attr('r', 8)
    .style('fill', d => d.color)

  nodeg.append('text')
    .attr('dx', 15)
    .attr('dy', 4)
    .text(d => d.name)

  // add Link
  const linkg = g.selectAll('g.link').data(data.links).enter()
    .append('g')
    .classed('link', true)

  linkg.append('path')
    .attr('d', 'M 0,8 L10,8 L10,-8 L0,-8 Z')
    .style('fill', d => d.color)

  linkg.append('text')
    .attr('dx', 25)
    .attr('dy', 4)
    .text(d => d.name)

  // 位置自适应
  let dx = 6
  g.selectAll('g.node')
    .each(function() {
      d3.select(this).attr('transform', `translate(${dx})`)
      dx += d3.select(this).node().getBBox().width + 10
    })
  dx += 20
  g.selectAll('g.link')
    .each(function() {
      d3.select(this).attr('transform', `translate(${dx})`)
      dx += d3.select(this).node().getBBox().width + 10
    })

  // 居中显示
  const gWidth = g.node().getBBox().width
  g.attr('transform', `translate(${(width - gWidth) / 2}, ${height / 2})`)
}
