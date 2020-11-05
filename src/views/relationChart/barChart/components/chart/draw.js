import * as d3 from 'd3'

function getColor(d, type) {
  const val = d.year
  const date = new Date()
  const y = date.getFullYear()
  if (val > y - 3) {
    return type ? '#6ACC85' : '#5FAD63'
  }
  if (val <= y - 3 && val >= y - 5) {
    return type ? '#1A93FA' : '#1661CD'
  }
  if (val <= y - 6 && val >= y - 10) {
    return type ? '#FBAD29' : '#CC8043'
  }
  return type ? '#F46B7B' : '#CE3649'
}

/** 绘制基础框架 */
export function drawBase(cfg) {
  const container = cfg.container
  const background = cfg.background
  const gridWidth = cfg.width - 140
  const gridHeight = cfg.height - 50

  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('margin-bottom', '-3px')
    .style('background-color', background)

  const group = svg.append('g').classed('group', true)
    .attr('transform', `translate(70, 20)`)

  group.append('clipPath')
    .attr('id', 'clip-barchart')
    .append('rect')
    .attr('x', 0)
    .attr('y', -20)
    .attr('width', gridWidth + 30)
    .attr('height', cfg.height)

  const g = group.append('g').attr('clip-path', 'url(#clip-barchart)')

  g.append('g').classed('bar', true)

  cfg.svg = svg
  cfg.group = group
  cfg.g = g
  cfg.gridWidth = gridWidth
  cfg.gridHeight = gridHeight
}

export function drawClear(cfg) {
  const group = cfg.group
  const g = cfg.g
  group.select('g.yAxis').remove()
  g.select('g.xAxis').remove()
  g.select('g.bar').selectAll('g.node').remove()
}

export function drawAxis(cfg) {
  // const gridWidth = cfg.gridWidth
  const gridHeight = cfg.gridHeight
  const group = cfg.group
  const g = cfg.g
  const time = cfg.time
  const maxCount = cfg.maxCount

  // y坐标轴
  group.append('g')
    .classed('yAxis', true)
    .style('color', '#000000')

    // x坐标轴
  g.append('g').classed('xAxis', true)
    .attr('transform', `translate(0, ${gridHeight})`)
    .style('color', '#000000')

  const xScale = cfg.xScale
  const xAxis = d3.axisBottom(xScale).ticks(time[1] - time[0]).tickSizeOuter(0)
    .tickFormat(v => {
      return '' + v
    })
  const xAxisg = g.select('g.xAxis').call(xAxis)

  const yScale = d3.scaleLinear().domain([maxCount, 0]).range([0, gridHeight])
  const yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0)
  const yAxisg = group.select('g.yAxis').call(yAxis)

  cfg.xAxisg = xAxisg
  cfg.yAxisg = yAxisg
}

export function render(cfg, data) {
  const gridHeight = cfg.gridHeight
  const nodes = data
  const g = cfg.g.select('g.bar')

  const nodeg = g.selectAll('g.node').data(nodes).enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => `translate(${d.x}, ${0})`)
    .style('font-size', 11)
    .style('cursor', 'pointer')

  // 其它
  nodeg.append('rect')
    .classed('other', true)
    .attr('x', -10)
    .attr('y', 0)
    .attr('width', 20)
    .attr('height', d => d.otherH)
    .style('fill', d => getColor(d, false))
    .attr('transform', d => `translate(0, ${gridHeight - d.otherH})`)

  nodeg.append('text')
    .text(d => d.other)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .style('fill', 'white')
    .style('opacity', d => d.otherH > 15 ? 1 : 0)
    .style('user-select', 'none')
    .attr('transform', d => `translate(0, ${gridHeight - d.otherH / 2})`)

  // 新任务
  nodeg.append('rect')
    .classed('task', true)
    .attr('x', -10)
    .attr('y', 0)
    .attr('width', 20)
    .attr('height', d => d.taskH)
    .style('fill', d => getColor(d, true))
    .attr('transform', d => `translate(0, ${gridHeight - d.otherH - d.taskH})`)

  nodeg.append('text')
    .text(d => d.newSituaTask)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .style('fill', 'white')
    .style('opacity', d => d.taskH > 15 ? 1 : 0)
    .style('user-select', 'none')
    .attr('transform', d => `translate(0, ${gridHeight - d.otherH - d.taskH / 2})`)
}
