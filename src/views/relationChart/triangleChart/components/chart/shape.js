const Nodes = {
  wenshu: {
    enter(selection, d, source) {
      const color = d.data.state === 'running' ? 'green' : 'gray'
      const option = {
        name: d.data.name,
        r: 30,
        t: 1000,
        toogle: d.children,
        color: color
      }
      d.r = option.r
      Nodes.enter(selection, option, source)
    },
    update(selection, d, source) {
      const option = {
        t: 1000
      }
      Nodes.update(selection, option, source)
    },
    exit(selection, d, source) {
      const option = {
        t: 1000
      }
      Nodes.exit(selection, option, source)
    }
  },
  /**
   * 添加元素
   */
  enter(selection, option, source) {
    const node = selection.append('g')
      .classed('node', true)
      .attr('transform', d => `translate(${source.data.x0}, ${source.data.y0})`)
      .style('cursor', 'pointer')

    node.append('title').text(option.name)

    node.append('circle')
      .attr('r', option.r)
      .style('fill', option.color)

    if (option.toogle) {
      const toggle = node.append('g')
        .classed('toggle', true)
        .attr('transform', `translate(0, ${option.r + 10})`)

      toggle.append('circle')
        .attr('r', 10)
        .style('fill', 'white')
        .style('stroke', option.color)

      toggle.append('path')
        .attr('d', d => togglePath(d.children))
        .style('pointer-events', 'none')
        .style('fill', 'none')
        .style('stroke', option.color)
    }

    const text = node.append('text')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .style('font-size', option.r / 2.5)
      .style('fill', 'white')

    text.selectAll('tspan').data(circleText(option.name))
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', d => d.dy)
      .text(d => d.text)

    node.transition()
      .duration(option.t)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
  },
  /**
   * 修改元素
   * @param {*} selection
   * @param {*} option
   * @param {*} source
   */
  update(selection, option, source) {
    selection.transition()
      .duration(option.t)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    selection.select('g.toggle').select('path')
      .attr('d', d => togglePath(d.children))
  },
  /**
   * 删除元素
   * @param {*} selection
   * @param {*} option
   * @param {*} source
   */
  exit(selection, option, source) {
    const exit = selection
      .transition()
      .duration(option.t)
      .attr('transform', `translate(${source.x}, ${source.y})`)
      .remove()

    exit.select('circle')
      .attr('r', 0)

    exit.select('text')
      .style('fill-opacity', 0)
  }
}

const Links = {
  default: {
    options: {
      color: 'red'
    },
    enter(selection, d, source) {
      const option = {
        color: 'green',
        t: 1000
      }
      Links.enter(selection, option, source)
    },
    update(selection, d, source) {
      const option = {
        color: 'green',
        t: 1000
      }
      Links.update(selection, option, source)
    },
    exit(selection, d, source) {
      const option = {
        color: 'green',
        t: 2000
      }
      Links.exit(selection, option, source)
    }
  },
  /**
   * 添加元素
   * @param {*} selection
   * @param {*} option
   * @param {*} source
   */
  enter(selection, option, source) {
    const link = selection.insert('g', 'g.node')
      .classed('link', true)

    link.append('path')
      .attr('id', d => d.target.id)
      .attr('marker-end', 'url(#markerArrow)')
      .style('fill', 'none')
      .style('stroke', option.color)
      .attr('d', linkPath({
        source: { x: source.data.x0, y: source.data.y0, r: source.r },
        target: { x: source.data.x0, y: source.data.y0, r: source.r }
      }))
      .transition()
      .duration(option.t)
      .attr('d', d => linkPath(d))

    link.append('text')
      .attr('dy', '-0.3em')
      .style('font-size', '14px')
      .style('user-select', 'none')
      .append('textPath')
      .attr('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .attr('xlink:href', d => `#${d.target.id}`)
  },
  /**
   * 修改元素
   * @param {*} selection
   * @param {*} option
   * @param {*} source
   */
  update(selection, option, source) {
    selection.select('path')
      .transition()
      .duration(option.t)
      .attr('d', d => linkPath(d))
  },
  /**
   * 删除元素
   * @param {*} selection
   * @param {*} option
   * @param {*} source
   */
  exit(selection, option, source) {
    const exit = selection.transition()
      .duration(option.t)
      .remove()

    exit.select('path')
      .attr('d', d => linkPath({
        source: { x: source.x, y: source.y, r: source.r },
        target: { x: source.x, y: source.y, r: source.r }
      }))
  }
}
/**
 * 切换开关样式
 * @param {*} children
 */
function togglePath(children) {
  if (children) {
    return `M 10,0 H -10`
  } else {
    return 'M 0,10 V -10 M -10,0 H 10'
  }
}

/**
 * 圆内文字
 * @param {*} text
 */
function circleText(text) {
  if (!text) {
    return { 'text': '', 'x': 0, 'y': 0 }
  }

  if (text.length <= 5) {	// 一行
    return [
      { 'text': text, 'dy': '0.5em' }
    ]
  }

  if (text.length <= 9) {	// 二行
    return [
      { 'text': text.substring(0, 4), 'dy': '0' },
      { 'text': text.substring(4, 9), 'dy': '1em' }
    ]
  }

  if (text.length > 9) {	// 三行
    const arr = [
      { 'text': text.substring(0, 4), 'dy': '-0.5em' },
      { 'text': text.substring(4, 9), 'dy': '0.5em' }
    ]

    const line3 = text.substring(9, 12)
    if (text.length > 12) {
      arr.push({ 'text': line3 + '..', 'dy': '1.5em' })
    } else {
      arr.push({ 'text': line3, 'dy': '1.5em' })
    }
    return arr
  }
}

function linkPath(d) {
  // console.log(d)
  // 三次贝塞尔曲线需要定义一个点和两个控制点，所以用C命令创建三次贝塞尔曲线，
  // 需要设置三组坐标参数：C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)，
  // 最后一个坐标(x,y)表示的是曲线的终点，另外两个坐标是控制点，(x1,y1)是起点的控制点，(x2,y2)是终点的控制点。
  const x1 = d.source.x // 起始点坐标
  const y1 = d.source.y + d.source.r + 20
  const x2 = d.target.x // 终止点坐标
  const y2 = d.target.y - d.target.r
  const r = y2 - y1
  return `M ${x1},${y1} C ${x1},${y1 + r / 2} ${x2},${y1 + r / 2} ${x2},${y2}`
}
export { Nodes, Links }
