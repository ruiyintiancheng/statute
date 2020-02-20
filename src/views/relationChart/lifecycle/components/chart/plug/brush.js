import * as d3 from 'd3'
import Data from '../data.js'
/**
 * 时间轴插件
 */
const Brush = {
  init(graph, id) {
    const width = 125
    const height = graph.get('height')

    const brush = d3.brushY()
      .extent([[0, 0], [10, height - 40]])
      .on('brush', brushed)
      .on('end', brushend)

    const x = d3.scaleTime()
      .domain([dataTime()[0], new Date()])
      .rangeRound([0, height - 40])

    const axis = d3.axisLeft(x)
      .ticks(6)
      .tickFormat(time => {
        return d3.timeFormat('%Y/%m')(time)
      })

    this.x = x
    this.brush = brush
    this.graph = graph

    const brushGroup = graph.get('svg').append('g').classed('brushg', true)

    brushGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', '#26368d')
      // .style('stroke', 'white')

    // 绘制笔刷
    brushGroup.append('rect')
      .attr('x', 61)
      .attr('y', 20)
      .attr('width', 10)
      .attr('height', height - 40)
      .style('fill', '#cdcfd2')

    this.brushg = brushGroup.append('g')
      .classed('brush', true)
      .attr('transform', 'translate(61, 20)')
      .call(brush)
      .call(brush.move, x.range())

    // this.brushg.select('rect.overlay').style('fill', 'gray')
    this.brushg.select('rect.selection')
      .style('stroke', 'none')
      .style('fill', 'black')

    // 绘制坐标轴
    const axisg = brushGroup.append('g')
      .classed('axis', true)
      .attr('transform', `translate(60, 20)`)
      .call(axis)

    axisg.select('.domain').style('stroke', 'none')
    axisg.selectAll('line').style('stroke', 'white')
    axisg.selectAll('text').style('fill', 'white')

    brushGroup.insert('g', '.brush')
      .classed('nodes', true)
      .attr('transform', `translate(66, 20)`)
      .selectAll('circle')
      .data(Data.getData())
      .join('circle')
      .attr('r', '6')
      .attr('transform', d => `translate(${x(new Date(d.docIssueTime))})`)
      .style('fill', '#4fbaf4')

    function brushed() {
      d3.select(this).call(brushHandle, d3.event.selection)
    }

    function brushend() {
      const selection = d3.event.selection

      if (!d3.event.sourceEvent || !selection) {
        return
      }

      const sx = selection.map(x.invert)
      handle(graph, sx)
    }

    function brushHandle(g, s) {
      g.selectAll('.handle--custom')
        .data([{ type: 'w', anchor: 'end' }, { type: 'e', achor: 'start' }])
        .join(enter => enter.append('text')
          .attr('class', 'handle--custom')
          .attr('dy', '0.35em')
          .style('user-select', 'none')
          .style('fill', 'white')
          .style('font-size', '12px')
        )
        .attr('display', s === null ? 'none' : null)
        .attr('transform', s === null ? null : (d, i) => `translate(15, ${s[i]})`)
        .text((d, i) => {
          return d3.timeFormat('%Y/%m')(x.invert(s[i]))
        })
    }
  },
  /**
   * move the brush selection all.
   * @param {*} selection
   */
  moveAll() {
    this.brushg.call(this.brush.move, this.x.range())
    handle(this.graph, this.x.domain())
  }
}

/**
 * 重绘画布
 * @param {*} graph
 * @param {*} sx [date1, date2]
 */
function handle(graph, sx) {
  graph.redraw(handleData(sx))
}

function handleData(time) {
  const data = Data.copyData(Data.getData())

  const newData = []
  data.forEach(d => {
    const date = new Date(d.docIssueTime)
    if (date.getTime() >= time[0].getTime() && date.getTime() <= time[1].getTime()) {
      newData.push(d)
    }
  })
  return newData
}

function dataTime() {
  const nodes = Data.getData()
  let minDate = null
  let maxDate = null

  nodes.forEach(d => {
    const date = new Date(d.docIssueTime)
    if (!minDate) {
      minDate = date
    }
    if (!maxDate) {
      maxDate = date
    }

    if (minDate >= date) {
      minDate = date
    }
    if (maxDate <= date) {
      maxDate = date
    }
  })
  return [minDate, maxDate]
}

export default Brush
