import Util from './util.js'
import Layout from './layout.js'
import Rander from './render.js'
import Event from './event.js'
import Behavior from './behavior.js'
import Data from './data.js'
import * as d3 from 'd3'

class Graph {
  constructor(inputCfg) {
    this._cfg = Util.deepMix(this.getDefaultCfg(), inputCfg)
    this._init()
  }

  getDefaultCfg() {
    return {
      type: 'ForceLayout',
      /**
       * 容器id
       * @type {String}
       */
      container: undefined,
      width: undefined,
      height: undefined,
      background: 'aliceblue'
    }
  }

  getNodes() {

  }

  get(key) {
    return this._cfg[key]
  }

  set(key, val) {
    this._cfg[key] = val
  }

  _init() {
    this._initCanvas()
  }

  _initCanvas() {
    const svg = d3.select('#' + this.get('container'))
      // .style('width', this.get('width') + 'px')
      // .style('height', this.get('height') + 'px')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('margin-bottom', '-3px')
      .style('background-color', this.get('background'))

    const g = svg.append('g').classed('group', true)

    this.set('svg', svg)
    this.set('g', g)

    // 添加箭头
    svg.append('defs').append('marker')
      .attr('id', 'markerArrow')
      .attr('markerWidth', 10)
      .attr('markerHeight', 6)
      .attr('refX', 9 + 12)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .attr('viewBox', '0 0 10 6')
      .append('path')
      .attr('d', 'M 0,0 L10,3 L0,6 L5,3 L0,0')
      .style('fill', '#4fbaf4')
  }
  /**
   * 绑定数据
   * @param {*} data
   */
  data(data) {
    this.set('data', data)
    Data.init(data)
    Layout.setConfig(this._cfg)
  }
  /**
   * 添加数据
   * @param {*} data
   */
  addData(data) {
    Data.addData(this.get('data'), data)
    this.set('data', Data.getData())
    this.remove()
    this.render()
    Behavior.relation(this._cfg, this.get('options'))
  }
  /**
    画布移动
    @param x // 横坐标
    @param y // 纵坐标
    @param scale // 比例
   */
  move(x, y, scale) {
    scale = scale || 1
    Event.move(this._cfg, { x, y, k: scale })
  }
  /**
    移动到屏幕中间
    @param x // 横坐标
    @param y // 纵坐标
    @param scale // 比例
   */
  moveCenter(x, y, scale) {
    scale = scale || 1
    Event.moveCenter(this._cfg, { x, y, k: scale })
  }
  translateCenter() {
    Event.translateCenter(this._cfg)
  }
  /**
   * 绘制图形
   */
  render() {
    Layout.init(this.get('data'))
    Rander.draw(this._cfg)
    Event.init(this._cfg)
  }
  /**
   * 清空图形
   */
  remove() {
    this.get('g').selectAll('g.link').remove()
    this.get('g').selectAll('g.node').remove()
  }
  /**
   * 重绘
   */
  redraw(data) {
    this.set('data', data)
    this.render()
    this.translateCenter()
    Behavior.relation(this._cfg, this.get('options'))
  }
  /**
   * 关系筛选
   * @param {*} options
   */
  relation(options) {
    this.set('options', options)
    Behavior.relation(this._cfg, options)
  }
  /**
   * 导出png图片
   * @param {*} title 图片标题
   */
  savePng(title) {
    Util.savePng(this._cfg, title)
  }
}

export { Graph }
