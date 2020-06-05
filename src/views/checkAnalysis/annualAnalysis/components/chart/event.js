// import Rander from './render.js'
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
    .on('zoom', () => {
      const x = d3.event.transform.x
      const newyear = cfg._xScale.invert(cfg.gridWidth - x)
      if (cfg.dataType === 'year') {
        if (newyear > cfg.yearRange[1] + 10 || newyear < cfg.yearRange[0] - 5) {
          return
        }

        cfg.g.select('g.circle').attr('transform', `translate(${x}) scale(1)`)
        // 改变x坐标轴
        const xScale = d3.scaleLinear().domain([newyear - 10, newyear]).range([0, cfg.gridWidth])
        cfg.xScale = xScale
        cfg.g.select('g.xaxis')
          .call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0).tickFormat(v => v + '年'))
      }

      if (cfg.dataType === 'month') {
        if (newyear > cfg.yearRange[1] * 12 + 24 || newyear < cfg.yearRange[0] * 12 - 6) {
          return
        }
        cfg.g.select('g.circle').attr('transform', `translate(${x}) scale(1)`)
        // 改变x坐标轴
        const xScale = d3.scaleLinear().domain([newyear - 12, newyear]).range([0, cfg.gridWidth])
        cfg.xScale = xScale
        cfg.g.select('g.xaxis')
          .call(d3.axisBottom(xScale).ticks(10).tickSizeOuter(0)
            .tickFormat(v => {
              return v % 12 === 0 ? `${parseInt(v / 12)}年1月` : `${v % 12 + 1}月`
            }))
      }
    })
    .on('end', () => {
      const x = d3.event.transform.x
      const newyear = cfg._xScale.invert(cfg.gridWidth - x)
      if (cfg.dataType === 'year') {
        if (newyear > cfg.yearRange[1] + 5) {
          move(cfg, { x: cfg.gridWidth - cfg._xScale(cfg.yearRange[1] + 5) + 10, y: 0, k: 1 })
        }

        if (newyear < cfg.yearRange[0] + 5) {
          move(cfg, { x: cfg.gridWidth - cfg._xScale(cfg.yearRange[0] + 5), y: 0, k: 1 })
        }
      }

      if (cfg.dataType === 'month') {
        if (newyear > cfg.yearRange[1] * 12 + 24) {
          move(cfg, { x: cfg.gridWidth - cfg._xScale(cfg.yearRange[1] * 12 + 24) + 400, y: 0, k: 1 })
        }
        if (newyear < cfg.yearRange[0] * 12 - 6) {
          move(cfg, { x: cfg.gridWidth - cfg._xScale(cfg.yearRange[0] * 12 - 6) - 400, y: 0, k: 1 })
        }
      }
    })

  cfg.svg.call(zoom)
  cfg.zoom = zoom
}

/**
  * 节点拖拽
  * @param {*} cfg
  */
// function drag(cfg) {
//   const drag = d3.drag() // 拖拽
//     // .on('start', nodeEvent.dragStart)
//     .on('drag', d => {
//       d.x = d3.event.x
//       // d.y = d3.event.y
//       Rander.tick()
//     })
//   // .on('end', nodeEvent.dragEnd);

//   cfg.g.selectAll('g.node').call(drag)
// }

function nodeEvent(cfg) {
  // const title = d3.select(`#${cfg.nodeTitle}`)
  // cfg.g.selectAll('g.node')
  //   .on('mouseover', d => {
  //     d3.event.preventDefault()
  //     d3.event.stopPropagation()

  //     title.style('display', 'block')
  //       .style('left', `${d3.event.offsetX + 10}px`)
  //       .style('top', `${d3.event.offsetY + 10}px`)
  //       .selectAll('div').data(d.data)
  //       .join('div')
  //       .text((text, i) => (i + 1) + '. ' + text.docName)
  //   })
  //   .on('mousemove', d => {
  //     d3.event.preventDefault()
  //     title.style('left', `${d3.event.offsetX + 10}px`)
  //       .style('top', `${d3.event.offsetY + 10}px`)
  //     d3.event.stopPropagation()
  //   })
  //   .on('mouseout', d => {
  //     d3.event.preventDefault()
  //     title.style('display', 'none')
  //     d3.event.stopPropagation()
  //   })
}
/**
 * 节点点击事件
 * @param {*} cfg
 */
function nodeClick(cfg) {
  cfg.g.selectAll('g.node').on('click', d => {
    d3.event.preventDefault()
    cfg.contextMenuNode = d
    cfg.openList(d.data)
    // console.log('click', d)
  })
}

function nodeMenu(cfg) {
  cfg.g.selectAll('g.node')
    .on('contextmenu', d => {
      // d3.event.preventDefault()
      // cfg.contextMenuNode = d
      // cfg.openList(d.data)
      // d3.select(`#${cfg.contextMenu}`)
      //   .style('display', 'block')
      //   .style('left', `${d3.event.offsetX + 10}px`)
      //   .style('top', `${d3.event.offsetY + 10}px`)
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
    // drag(cfg)
    nodeClick(cfg)
    nodeMenu(cfg)
    nodeEvent(cfg)
  },
  move,
  moveCenter,
  translateCenter
}

export default Event
