import * as d3 from 'd3'

function zoom(cfg) {
  const zoom = d3.zoom()
    .on('zoom', () => {
      const x = d3.event.transform.x

      if (x > 0) {
        return
      }

      cfg.g.select('g.bar').attr('transform', `translate(${x}) scale(1)`)
      cfg.g.select('g.xAxis').attr('transform', `translate(${x}, ${cfg.gridHeight}) scale(1)`)
    })
    .on('end', () => {
      const x = d3.event.transform.x
      if (x > 0) {
        move(cfg, { x: -15, y: 0, k: 1 })
      }

      if (cfg.chart_width > cfg.gridWidth && -cfg.chart_width + cfg.gridWidth / 2 > x) {
        move(cfg, { x: -cfg.chart_width + cfg.gridWidth / 2 + 100, y: 0, k: 1 })
      }
    })

  cfg.svg.call(zoom)
  cfg.zoom = zoom
}

function nodeClick(cfg) {
  cfg.g.selectAll('g.node').select('rect.other')
    .on('click', d => {
      d3.event.preventDefault()
      d3.event.stopPropagation()
      cfg.nodeClick({
        year: d.year,
        count: d.other,
        newSituaTask: '否'
      })
    })
    .on('mouseover', function() {
      d3.select(this)
        .attr('x', -12)
        .attr('width', 24)
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('x', -10)
        .attr('width', 20)
    })

  cfg.g.selectAll('g.node').select('rect.task')
    .on('click', d => {
      d3.event.preventDefault()
      d3.event.stopPropagation()
      cfg.nodeClick({
        year: d.year,
        count: d.newSituaTask,
        newSituaTask: '是'
      })
    })
    .on('mouseover', function() {
      d3.select(this)
        .attr('x', -12)
        .attr('width', 24)
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('x', -10)
        .attr('width', 20)
    })
}

function nodeMove(cfg) {
  cfg.g.selectAll('g.node')
    .on('mouseover', d => {

    })
    .on('mousemove', d => {
      // d3.event.preventDefault()
      // d3.event.stopPropagation()
      const mouse = eventPoint(d3.event, cfg.container)
      cfg.nodeMove({
        x: mouse.x,
        y: mouse.y,
        year: d.year + '年',
        newSituaTask: d.newSituaTask,
        other: d.other
      })
    })
    .on('mouseout', d => {
      // d3.event.preventDefault()
      // d3.event.stopPropagation()
      cfg.nodeMove(null)
    })
}

// 计算鼠标在元素内的位置
function eventPoint(event, element) {
  const mouseX = event.clientX
  const mouseY = event.clientY
  const top = element.getBoundingClientRect().top
  const left = element.getBoundingClientRect().left
  return {
    x: mouseX - left,
    y: mouseY - top
  }
}

// 初始化加载事件
export function initEvent(cfg) {
  zoom(cfg)
}

export function loadEvent(cfg) {
  if (cfg.nodeClick) {
    nodeClick(cfg)
  }
  if (cfg.nodeMove) {
    nodeMove(cfg)
  }
}

// 移动画布到指定坐标
export function move(cfg, transform) {
  const t = d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k)
  cfg.svg.call(cfg.zoom.transform, t)
}
