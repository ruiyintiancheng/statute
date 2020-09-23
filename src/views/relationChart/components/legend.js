import * as d3 from 'd3'

export function legend(cfg) {
  const container = cfg.container
  const width = cfg.width
  const height = cfg.height
  const background = cfg.background || '#ffffff'
  // const height = 30
  const legends = {
    nodes: [
      { name: '查询法规', color: '#ff804c', translate: 'translate(0)' },
      { name: '政策法规', color: '#02A7FD', translate: 'translate(94)' },
      { name: '废止公文', color: '#b8b7b6', translate: 'translate(188)' },
      { name: '定位法规', color: '#9EEA6A', translate: 'translate(295)' }
    ],
    links: [
      { name: '被引用', color: '#a0dbf9', translate: 'translate(379)' }
    ]
  }

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
  const nodeg = g.selectAll('g.node').data(legends.nodes).enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => d.translate)

  nodeg.append('circle')
    .attr('r', 8)
    .style('fill', d => d.color)

  nodeg.append('text')
    .attr('dx', 15)
    .attr('dy', 4)
    .text(d => d.name)

  // add Link
  const linkg = g.selectAll('g.link').data(legends.links).enter()
    .append('g')
    .classed('link', true)
    .attr('transform', d => d.translate)

  linkg.append('path')
    .attr('d', 'M 0,3 L10,3 L10,8 L16,0 L10,-8 L10,-3 L0,-3 Z')
    .style('fill', d => d.color)

  linkg.append('text')
    .attr('dx', 25)
    .attr('dy', 4)
    .text(d => d.name)

  const gWidth = g.node().getBBox().width
  g.attr('transform', `translate(${(width - gWidth) / 2}, ${height / 2})`)
}
