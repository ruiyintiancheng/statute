// import * as d3 from 'd3'
import Event from './event.js'
// import { Nodes, Links } from './shape.js'

const Rander = {
  /**
   * 绘制图形
   * @param {*} cfg
   */
  reDraw(cfg, source) {
    this._cfg = cfg
    // const g = cfg.g
    // d3.tree().nodeSize([100, 300])(this._cfg.root)

    // const nodes = this._cfg.root.descendants()
    // const links = this._cfg.root.links()
    // this._cfg.nodes = nodes
    // this._cfg.links = links
    this.draw(cfg)

    // const nodeg = g.selectAll('g.node').data(nodes, d => d.id)
    // // add Node
    // nodeg.enter().each(function(d) {
    //   Nodes[d.data.label].enter(d3.select(this), d, source)
    // })
    // // update Node
    // nodeg.each(function(d) {
    //   Nodes[d.data.label].update(d3.select(this), d, source)
    // })
    // // exit Node
    // nodeg.exit().each(function(d) {
    //   Nodes[d.data.label].exit(d3.select(this), d, source)
    // })

    // const linkg = g.selectAll('g.link').data(links, d => d.target.id)
    // // add Link
    // linkg.enter().each(function(d) {
    //   Links['default'].enter(d3.select(this), d, source)
    // })
    // // update Link
    // linkg.each(function(d) {
    //   Links['default'].update(d3.select(this), d, source)
    // })
    // // exit Link
    // linkg.exit().each(function(d) {
    //   Links['default'].exit(d3.select(this), d, source)
    // })

    // nodes.forEach(d => {
    //   d.data.x0 = d.x
    //   d.data.y0 = d.y
    // })

    Event.bind(this._cfg)
  },
  draw(cfg) {
    const g = cfg.g
    const data = cfg.data
    const color = ['#248EA6', '#25C7D9', '#F2D338', '#F2762E', '#F23030']

    const nodeg = g.selectAll('g.node').data(data).enter()
      .append('g')
      .classed('node', true)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('font-size', '16px')

    nodeg.append('polygon')
      .attr('points', d => d.polygon)
      .style('fill', d => color[d.orgRank - 1])
      .style('stroke', 'white')
    nodeg.append('title')
      .text(d => `发布单位: ${d.orgName}; 发布数量: ${d.count};`)
    console.log(data)
    const textg = g.selectAll('g.text').data(data).enter()
      .append('g')
      .classed('text', true)
      .style('font-size', '16px')

    // textg.append('path')
    //   .style('fill', 'none')
    //   .style('stroke', 'black')
    //   .attr('d', (d, i) => {
    //     return `M ${d.x + d.width / 2},${d.y + d.height - 10}  L ${cfg.height + 20},${22 * i}`
    //   })

    // textg.append('text')
    //   .attr('x', cfg.height + 20)
    //   .attr('y', (d, i) => 22 * i)
    //   .text((d, i) => `${i + 1}. ${d.orgName}(${d.count})`)

    textg.append('text')
      .attr('x', d => 100 * (d.depth + 1) + 10)
      .attr('y', d => d.y)
      .attr('dx', d => parseInt(d.index / 5) * 20 + 'em')
      .attr('dy', d => d.index % 5 * 1.2 + 0.35 + 'em')
      .text((d, i) => `${d.index + 1}. ${d.orgName}(${d.count})`)
  },
  /**
   * 更新图形
   */
  tick() {
    console.log('tick')
  }
}
export default Rander
