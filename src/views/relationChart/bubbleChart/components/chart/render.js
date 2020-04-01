import * as d3 from 'd3'
// import { Nodes, Links } from './shape.js'

const Rander = {
  /**
   * 绘制图形
   * @param {*} cfg
   */
  draw(cfg) {
    this._cfg = cfg
    const nodes = cfg.data

    const year = (new Date()).getFullYear()
    const x = d3.scaleLinear()
      .domain([year - 10, year])
      .range([0, cfg.gridWidth])

    const y = d3.scaleLinear()
      .domain([12, 0])
      .range([0, cfg.gridHeight])

    drawAxis(cfg, x, y)

    const nodeg = cfg.g.select('g.circle').selectAll('g.node')
      .data(nodes, d => d.id)
      .enter()
      .append('g')
      .classed('node', true)
      .attr('transform', d => `translate(${x(d.year)}, ${y(d.month)})`)

    nodeg.append('circle')
      .attr('r', 10)
      .style('fill', d => d.color)

    nodeg.append('text')
      .text(d => d.data.length)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', 12)
  }

  //   const nodes = cfg.data.nodes
  //   const links = cfg.data.links

  //   const nodeg = g.selectAll('g.node').data(nodes, d => d.id)
  //   // add Node
  //   nodeg.enter().each(function(d) {
  //     Nodes['default'].enter(d3.select(this), d)
  //   })
  //   // update Node
  //   nodeg.each(function(d) {
  //     Nodes['default'].update(d3.select(this), d)
  //   })
  //   // exit Node
  //   nodeg.exit().each(function(d) {
  //     Nodes['default'].exit(d3.select(this), d)
  //   })

  //   const linkg = g.selectAll('g.link').data(links, d => d.id)
  //   // add Link
  //   linkg.enter().each(function(d) {
  //     Links['default'].enter(d3.select(this), d)
  //   })
  //   // update Link
  //   linkg.each(function(d) {
  //     Links['default'].update(d3.select(this), d)
  //   })
  //   // exit Link
  //   linkg.exit().each(function(d) {
  //     Links['default'].exit(d3.select(this), d)
  //   })

  //   this.tick()
  // },
  // /**
  //  * 更新图形
  //  */
  // tick() {
  //   const g = this._cfg.g
  //   const linkg = g.selectAll('g.link')
  //   linkg.select('path')
  //     .attr('d', d => path(d))
  //   linkg.select('text')
  //     .attr('rotate', d => rotate(d))
  //     .select('textPath')
  //     .text(d => pathText(d))

  //   g.selectAll('g.node').attr('transform', d => `translate(${d.x}, ${d.y})`)
  // }
}

function drawAxis(cfg, x, y) {
  const gridWidth = cfg.gridWidth
  const gridHeight = cfg.gridHeight
  cfg.g.append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('x', 0)
    .attr('y', -20)
    .attr('width', gridWidth + 30)
    .attr('height', gridHeight + 20)

  // x坐标轴
  const xaxis = d3.axisBottom(x).ticks(10).tickSizeOuter(0)
  const xaxisg = cfg.g.append('g')
    .classed('xaxis', true)
    .attr('transform', `translate(0, ${gridHeight})`)
    .style('color', 'white')
    .call(xaxis)

  // y坐标轴
  const yaxis = d3.axisLeft(y).ticks(12)

  const yaxisg = cfg.g.append('g')
    .classed('yaxis', true)
    .style('color', 'white')
  //   .attr('transform', `translate(60, 20)`)
    .call(yaxis)

  // 绘制网格
  xaxisg.selectAll('g.tick')
    .append('line')
    .classed('grid', true)
    .attr('y2', -gridHeight)
    .style('stroke', 'currentColor')
    .style('opacity', 0.3)
    .style('stroke-dasharray', '5,5')

  yaxisg.selectAll('g.tick')
    .append('line')
    .classed('grid', true)
    .attr('x2', gridWidth)
    .style('stroke', 'currentColor')
    .style('opacity', 0.3)
    .style('stroke-dasharray', '5,5')

  cfg.g.append('g').attr('clip-path', 'url(#clip)')
    .append('g').classed('circle', true)
}
export default Rander
