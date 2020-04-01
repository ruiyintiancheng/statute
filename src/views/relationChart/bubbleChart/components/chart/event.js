import Rander from './render.js'
import * as d3 from 'd3'

function canvas(cfg) {
  cfg.svg.on('click', function() {
    if (cfg.contextMenu) {
      d3.select(`#${cfg.contextMenu}`)
        .style('display', 'none')
    }
  })
}
/**
 * 画布缩放
 * @param {*} cfg
 */
function zoome(cfg) {
  const zoom = d3.zoom()
    .scaleExtent([0.2, 4])
    .on('zoom', () => {
      const x = d3.event.transform.x
      cfg.g.select('g.circle').attr('transform', `translate(${x}) scale(1)`)
    })

  cfg.svg.call(zoom)
  cfg.zoom = zoom
}

/**
  * 节点拖拽
  * @param {*} cfg
  */
function drag(cfg) {
  const drag = d3.drag() // 拖拽
    // .on('start', nodeEvent.dragStart)
    .on('drag', d => {
      d.x = d3.event.x
      // d.y = d3.event.y
      Rander.tick()
    })
  // .on('end', nodeEvent.dragEnd);

  cfg.g.selectAll('g.node').call(drag)
}

function nodeEvent(cfg) {
  const title = d3.select(`#${cfg.nodeTitle}`)
  cfg.g.selectAll('g.node')
    .on('mouseover', d => {
      d3.event.preventDefault()
      d3.event.stopPropagation()

      title.style('display', 'block')
        .style('left', `${d3.event.offsetX + 10}px`)
        .style('top', `${d3.event.offsetY + 10}px`)
        .selectAll('div').data(d.data)
        .join('div')
        .text((text, i) => (i + 1) + '. ' + text.docName)
    })
    .on('mousemove', d => {
      d3.event.preventDefault()
      title.style('left', `${d3.event.offsetX + 10}px`)
        .style('top', `${d3.event.offsetY + 10}px`)
      d3.event.stopPropagation()
    })
    .on('mouseout', d => {
      d3.event.preventDefault()
      title.style('display', 'none')
      d3.event.stopPropagation()
    })
}
/**
 * 节点点击事件
 * @param {*} cfg
 */
function nodeClick(cfg) {
  cfg.g.selectAll('g.node').on('click', d => {
    console.log('click', d)
  })
}

function nodeMenu(cfg) {
  cfg.g.selectAll('g.node').on('contextmenu', d => {
    d3.event.preventDefault()
    cfg.contextMenuNode = d
    d3.select(`#${cfg.contextMenu}`)
      .style('display', 'block')
      .style('left', `${d3.event.offsetX + 10}px`)
      .style('top', `${d3.event.offsetY + 10}px`)
  })
}

/**
 * 画布移动
 * @param {*} cfg
 * @param {*} transform
 */
function move(cfg, transform) {
  const t = d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k)
  cfg.svg.call(cfg.zoom.transform, t)
}
/**
 * 移动到屏幕中间
 * @param {*} cfg
 * @param {*} transform
 */
function moveCenter(cfg, transform) {
  cfg.zoom.translateTo(cfg.svg, transform.x, transform.y)
  cfg.zoom.scaleTo(cfg.svg, transform.k)
}
/**
 * 图像缩放到屏幕中间
 */
function translateCenter(cfg) {
  const gbox = cfg.g.node().getBBox()
  const x = gbox.x + gbox.width / 2
  const y = gbox.y + gbox.height / 2
  moveCenter(cfg, { x: x, y: y, k: 1 })
}

const Event = {
  init: function(cfg) {
    canvas(cfg)
    zoome(cfg)
    drag(cfg)
    nodeClick(cfg)
    nodeMenu(cfg)
    nodeEvent(cfg)
  },
  move,
  moveCenter,
  translateCenter
}

export default Event
