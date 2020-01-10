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
      d._show = true
      for (const key in options) {
        const values = options[key]

        if (d[key] && values && values.length > 0) {
          let show = false
          values.forEach(value => {
            if (d[key] === value) {
              show = true
            }
          })
          d._show = d._show && show
        }
      }
    })

    cfg.g.selectAll('g.node')
      .style('opacity', d => {
        return d._show ? 1 : 0.2
      })

    cfg.g.selectAll('g.link')
      .style('opacity', d => {
        return d.source._show && d.target._show ? 1 : 0.2
      })
  }
}

export default Behavior
