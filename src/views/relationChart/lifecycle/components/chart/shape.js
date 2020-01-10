const Nodes = {
  default: {
    enter(selection, d) {
      let color = d.docState === 'running' ? 'green' : 'gray'
      if (d.queryNode === true) {
        color = 'red'
      }
      const option = {
        name: d.docName,
        r: 30,
        color: color
      }
      d.r = option.r

      Nodes.enter(selection, option)
    },
    update(selection, d) {
      const option = {
        r: 30,
        t: 1000
      }
      d.r = option.r
      Nodes.update(selection, option)
    },
    exit(selection, d) {
      const option = {
        t: 1000
      }
      Nodes.exit(selection, option)
    }
  },
  /**
   * 添加元素
   */
  enter(selection, option) {
    const node = selection.append('g')
      .classed('node', true)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .style('font-size', option.r / 2.5)

    node.append('title').text(option.name)

    node.append('circle')
      .attr('r', option.r)
      .style('fill', option.color)

    const text = node.append('text')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .style('fill', 'white')

    text.selectAll('tspan').data(circleText(option.name))
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', d => d.dy)
      .text(d => d.text)

    node.append('text')
      .attr('y', option.r)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .style('fill', 'blake')
      .text(d => `(${d.docIssueTime})`)
  },
  /**
   * 修改元素
   * @param {*} selection
   * @param {*} option
   */
  update(selection, option) {
    // console.log('update')
  },
  /**
   * 删除元素
   * @param {*} selection
   * @param {*} option
   */
  exit(selection, option) {
    selection.remove()
  }
}

const Links = {
  default: {
    enter(selection, d) {
      const option = {
        color: 'green'
      }
      Links.enter(selection, option)
    },
    update(selection, d) {
      const option = {
        color: 'green',
        t: 1000
      }
      Links.update(selection, option)
    },
    exit(selection, d) {
      const option = {
        color: 'green',
        t: 1000
      }
      Links.exit(selection, option)
    }
  },
  /**
   * 添加元素
   * @param {*} selection
   * @param {*} option
   */
  enter(selection, option) {
    const link = selection.insert('g', 'g.node')
      .classed('link', true)

    link.append('path')
      .attr('id', d => d.id)
      .attr('d', d => linkPath(d))
      .attr('marker-end', 'url(#markerArrow)')
      .style('fill', 'none')
      .style('stroke', option.color)

    link.append('text')
      .attr('dy', '-0.3em')
      .style('font-size', '14px')
      .style('user-select', 'none')
      .append('textPath')
      .attr('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .attr('xlink:href', d => `#${d.id}`)
  },
  /**
   * 修改元素
   * @param {*} selection
   * @param {*} option
   */
  update(selection, option) {
  },
  /**
   * 删除元素
   * @param {*} selection
   * @param {*} option
   */
  exit(selection, option) {
    selection.remove()
  }
}

// 圆内文字
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
  const x1 = d.source.x + d.source.r
  const y1 = d.source.y // 起始点坐标
  const x2 = d.target.x - d.target.r
  const y2 = d.target.y // 终止点坐标

  return `M ${x1},${y1} L ${x2},${y2}`
}
export { Nodes, Links }
