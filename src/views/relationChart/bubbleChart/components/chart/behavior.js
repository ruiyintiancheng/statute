import Data from './data.js'

const Behavior = {
  showAll(cfg) {
    console.log('clear')
    const newData = []
    const nodes = Data.getData()
    nodes.forEach(d => {
      newData.push(d)
    })
    cfg.data = newData
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
    const newData = []
    const nodes = Data.getData()
    nodes.forEach(d => {
      d._show = options(d)
      if (d._show) {
        newData.push(d)
      }
    })
    cfg.data = newData
  }
}

export default Behavior
