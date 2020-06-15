import Rander from './render.js'
import * as d3 from 'd3'

function canvas(cfg) {
  cfg.svg.on('click', function() {
    if (cfg.event_nodeClick) {
      clearNodeClick(cfg)
      cfg.event_nodeClick = null
    }
    if (cfg.contextMenu) {
      d3.select(`#${cfg.contextMenu}`)
        .style('display', 'none')
    }
  })
}

// 节点点击效果
function handleNodeClick(cfg) {
  const id = cfg.event_nodeClick
  const links = cfg.data.links
  links.forEach(d => {
    d._clickShow = false
    d.source._clickShow = d.target._clickShow = false
    if (d.source.id === id || d.target.id === id) {
      d._clickShow = true
    }
  })
  cfg.g.selectAll('g.link')
    .style('opacity', d => {
      if (d._clickShow === true) {
        d.source._clickShow = d.target._clickShow = true
        return 1
      }
      return 0.2
    })

  cfg.g.selectAll('g.node')
    .style('opacity', d => {
      return d._clickShow === true ? 1 : 0.2
    })
}
// 节点点击取消效果
function clearNodeClick(cfg) {
  cfg.g.selectAll('g.node')
    .style('opacity', d => {
      return d._show ? 1 : 0.2
    })

  cfg.g.selectAll('g.link')
    .style('opacity', d => {
      return d.source._show && d.target._show ? 1 : 0.2
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
      cfg.g.attr('transform', d3.event.transform)
      const k = d3.event.transform.k
      const nodes = cfg.g.selectAll('g.node')
      const links = cfg.g.selectAll('g.link')
      // 按比例保持图像大小
      if (k > 1) {
        nodes.select('circle').attr('transform', d => `scale(${1 / k})`)
        nodes.selectAll('text').attr('transform', d => `scale(${1 / k})`)

        links.selectAll('path')
          .attr('marker-end', 'url(#markerArrow2)')
          .style('stroke-width', d => 2 / k)
      }

      // 隐藏文字
      if (k < 0.5) {
        nodes.selectAll('text').style('display', 'none')
      } else {
        nodes.selectAll('text').style('display', null)
      }
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
    // .on('start', d => {})
    .on('drag', d => {
      d.x = d3.event.x
      d.y = d3.event.y
      Rander.tick()
    })
  // .on('end', nodeEvent.dragEnd);

  cfg.g.selectAll('g.node').call(drag)
}

/**
 * 节点点击事件
 * @param {*} cfg
 */
function nodeClick(cfg) {
  cfg.g.selectAll('g.node').on('click', d => {
    d3.event.preventDefault()
    d3.event.stopPropagation()
    cfg.event_nodeClick = d.id
    handleNodeClick(cfg)
  })
}

function nodeMenu(cfg) {
  cfg.g.selectAll('g.node')
    .filter(d => {
      return d.docState === 'running'
    })
    .on('contextmenu', function(d) {
      d3.event.preventDefault()

      const offsetX = d3.event.pageX - cfg.offset()[0]
      const offsetY = d3.event.pageY - cfg.offset()[1]
      cfg.contextMenuNode = d
      d3.select(`#${cfg.contextMenu}`)
        .style('display', 'block')
        .style('top', `${offsetY + 10}px`)
        .style('left', `${offsetX + 10}px`)
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
  if (cfg.queryNode) {
    const x = cfg.queryNode.x
    const y = cfg.queryNode.y
    moveCenter(cfg, { x, y, k: 1 })
  }
  // const gbox = cfg.g.node().getBBox()
  // const x = gbox.x + gbox.width / 2
  // const y = gbox.y + gbox.height / 2
  // moveCenter(cfg, { x: x, y: y, k: 1 })
}

const Event = {
  init: function(cfg) {
    canvas(cfg)
    zoome(cfg)
    drag(cfg)
    nodeClick(cfg)
    nodeMenu(cfg)
  },
  move,
  moveCenter,
  translateCenter
}

export default Event
