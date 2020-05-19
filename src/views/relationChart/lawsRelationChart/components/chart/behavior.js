import * as d3 from 'd3'
/**
 * 动画效果
 * @param {*} cfg
 * @param {*} moveId
 */
function animation(cfg, moveId) {
  cfg.g.selectAll('g.node').each(function(d) {
    d.animation = false
    if (d.queryNode === true) {
      d.animation = true
      d.anColor = ['#ff0000', '#ff804c']
    }
    if (moveId && d.id === moveId) {
      d.animation = true
      d.anColor = ['#0e867a', '#9EEA6A']
    }
  })

  cfg.g.selectAll('g.node')
    .each(function(d) {
      const an = d3.select(this).select('circle')
      const t = 1000 * 1
      an.transition()
        .on('end', function repeat() {
          if (d.animation) {
            d3.active(this)
              .transition()
              .duration(t)
              .style('fill', d.anColor[0])
              .transition()
              .duration(t)
              .style('fill', d.anColor[1])
              .on('end', repeat)
            // console.log('end', d.id)
          } else {
            d3.active(this).transition().style('fill', d._color)
          }
        })
    })
}

const Behavior = {
  showAll(cfg) {
    cfg.g.selectAll('g.node').style('opacity', 1)
    cfg.g.selectAll('g.link').style('opacity', 1)
  },
  /**
   * 筛选顶点
   * @param {*} cfg
   * @param {*} relations {key: [values]}
   */
  relation(cfg, options) {
    if (!options) {
      this.showAll(cfg)
      return
    }
    const nodes = cfg.data.nodes
    nodes.forEach(d => {
      d._show = options(d)
    })

    cfg.g.selectAll('g.node')
      .style('opacity', d => {
        return d._show ? 1 : 0.2
      })

    cfg.g.selectAll('g.link')
      .style('opacity', d => {
        return d.source._show && d.target._show ? 1 : 0.2
      })
  },
  animation
}

export default Behavior
