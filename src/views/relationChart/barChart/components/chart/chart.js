
import * as Draw from './draw'
import * as Layout from './layout'
import * as Event from './event'

let cfg = {}
/** 设置配置信息 */
export function setCfg(config) {
  cfg = config
  Draw.drawBase(cfg)
  Event.initEvent(cfg)
}

// 加载数据
export function data(data) {
  const newData = Layout.layout(cfg, data)
  Draw.drawClear(cfg)
  Event.move(cfg, { x: 0, y: 0, k: 1 })
  if (newData.length === 0) {
    return
  }
  Draw.drawAxis(cfg)
  Draw.render(cfg, newData)
  Event.loadEvent(cfg)

  if (cfg.chart_width > cfg.gridWidth) {
    Event.move(cfg, { x: -cfg.chart_width + cfg.gridWidth, y: 0, k: 1 })
  }
}
