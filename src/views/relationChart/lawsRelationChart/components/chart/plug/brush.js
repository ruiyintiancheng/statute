import * as d3 from 'd3'
import Data from '../data.js'
/**
 * 时间轴插件
 */
const Brush = {
  init(graph, id) {
    const width = graph.get('width')
    const height = 50

    const brush = d3.brushX()
      .extent([[0, 0], [width - 140, height - 20]])
      .on('brush', brushed)
      .on('end', brushend)

    const x = d3.scaleTime()
      .domain([dataTime()[0], new Date()])
      .rangeRound([0, width - 140])

    const axis = d3.axisBottom(x)
      .ticks(16)
      .tickFormat(time => {
        return d3.timeFormat('%Y/%m')(time)
      })

    this.x = x
    this.brush = brush
    this.graph = graph

    const svg = d3.select('#' + id)
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .style('border-bottom', '#ccc 1px solid')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('margin-bottom', '-3px')
      .style('background-color', 'white')

    this.brushg = svg.append('g')
      .classed('brush', true)
      .attr('transform', 'translate(70)')
      .call(brush)
      .call(brush.move, x.range())

    svg.append('g')
      .classed('axis', true)
      .attr('transform', `translate(70, ${height - 20})`)
      .call(axis)

    svg.append('g')
      .classed('nodes', true)
      .attr('transform', `translate(70, ${(height - 20) / 2})`)
      .selectAll('circle')
      .data(Data.getData().nodes)
      .join('circle')
      .attr('r', '3')
      .attr('transform', d => `translate(${x(new Date(d.docIssueTime))})`)
      .style('fill', 'red')

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
          .attr('text-anchor', d => d.anchor)
          .style('user-select', 'none')
          .style('fill', 'black')
          .style('font-size', '12px')
        )
        .attr('display', s === null ? 'none' : null)
        .attr('transform', s === null ? null : (d, i) => `translate(${s[i]}, 20)`)
        .text((d, i) => {
          return d3.timeFormat('%Y/%m/%d')(x.invert(s[i]))
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
  const json = { nodes: [], links: [] }

  const nodes = new Set()
  data.nodes.forEach(d => {
    const date = new Date(d.docIssueTime)
    if (date.getTime() >= time[0].getTime() && date.getTime() <= time[1].getTime()) {
      nodes.add(d.id)
      json.nodes.push(d)
    } else {
      // console.log(d)
    }
  })
  data.links.forEach(d => {
    if (nodes.has(d.source) && nodes.has(d.target)) {
      json.links.push(d)
    }
  })
  return json
}

function dataTime() {
  const nodes = Data.getData().nodes
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
