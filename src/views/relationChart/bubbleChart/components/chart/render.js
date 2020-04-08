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
    const x = cfg._xScale
    const y = cfg.yScale
    const r = cfg.rScale
    const nodeg = cfg.g.select('g.circle').selectAll('g.node').data(nodes, d => d.year + d.month)

    const nodeEnter = nodeg.enter()
      .append('g')
      .classed('node', true)
      .attr('id', d => d.year + d.month)
      .attr('transform', d => {
        if (cfg.dataType === 'year') {
          return `translate(${x(d.year)}, ${y(d.data.length)})`
        }
        return `translate(${x(d.year * 12 + d.month - 1)}, ${y(d.data.length)})`
      })

    nodeEnter.append('circle')
      .attr('r', d => r(d.data.length))
      .style('fill', d => d.color)
      .style('cursor', 'pointer')

    nodeEnter.append('text')
      .text(d => d.data.length)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', 12)
      .style('fill', 'white')
      .style('user-select', 'none')

    nodeg.select('text')
      .text(d => d.data.length)
    nodeg.exit().remove()
  },

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
  //   // exit Nodenodeg.exit()
  //   nodeg.exit().each(function(d) {
  //     Nodes['default'].exit(d3.select(this), d)
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
  // 绘制坐标网格
  drawInit(cfg) {
    const gridWidth = cfg.width - 140
    const gridHeight = cfg.height - 50

    cfg.gridWidth = gridWidth
    cfg.gridHeight = gridHeight

    cfg.g.append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('x', 0)
      .attr('y', -20)
      .attr('width', gridWidth + 30)
      .attr('height', gridHeight + 20)

    // x坐标轴
    cfg.g.append('g').classed('xaxis', true)
      .attr('transform', `translate(0, ${gridHeight})`)
      .style('color', 'white')
    // y坐标轴
    cfg.g.append('g')
      .classed('yaxis', true)
      .style('color', 'white')

    cfg.g.append('g').attr('clip-path', 'url(#clip)')
      .append('g').classed('circle', true)

    this.drawAxis(cfg)
  },
  drawAxis(cfg) {
    const gridWidth = cfg.width - 140
    const gridHeight = cfg.height - 50
    const year = (new Date()).getFullYear()

    const _xScale = d3.scaleLinear()
      .range([0, gridWidth])

    const yScale = d3.scaleLinear()
      .range([gridHeight - 10, gridWidth / 10 / 2])

    const rScale = d3.scaleLinear()
      .range([10, gridWidth / 10 / 2])

    if (cfg.dataType === 'year') {
      _xScale.domain([year - 10, year])
      // x坐标轴
      const xaxis = d3.axisBottom(_xScale).ticks(10).tickSizeOuter(0)
        .tickFormat(v => v + '年')
      cfg.g.select('g.xaxis').call(xaxis)
    }

    if (cfg.dataType === 'month') {
      _xScale.domain([year * 12 - 12, year * 12])
      // x坐标轴
      const xaxis = d3.axisBottom(_xScale).ticks(10).tickSizeOuter(0)
        // .tickValues([1, 2, 3, 5, 8, 13, 21])
        .tickFormat(v => {
          return v % 12 === 0 ? `${parseInt(v / 12)}年1月` : `${v % 12 + 1}月`
        })
      cfg.g.select('g.xaxis').call(xaxis)
    }

    yScale.domain(cfg.countRange)
    rScale.domain(cfg.countRange)

    cfg._xScale = _xScale
    cfg.yScale = yScale
    cfg.xScale = _xScale
    cfg.rScale = rScale

    // y坐标轴
    const yaxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0)
    const yaxisg = cfg.g.select('g.yaxis').call(yaxis)
    yaxisg.select('path.domain')
      .attr('d', `M1,${gridHeight} V${gridWidth / 10 / 2}`)
    // 改变x坐标轴
    // const xScale = d3.scaleLinear().domain([newyear - 10, newyear]).range([0, cfg.gridWidth])
    // cfg.xScale = xScale
    // cfg.g.select('g.xaxis').call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0).tickFormat(v => v + '年'))
  }
}
export default Rander
