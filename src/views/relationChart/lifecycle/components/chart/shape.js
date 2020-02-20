const Nodes = {
  default: {
    enter(selection, d, i) {
      const color = d.docState === 'running' ? '#4fbaf4' : '#b8b7b6'
      const option = {
        i: i,
        name: d.docName,
        r: 12,
        color: color,
        texts: [
          { title: '法规名称', value: d.docName },
          { title: '发布时间', value: d.docIssueTime }
        ]
      }
      if (d.queryNode === true) {
        option.color = '#ff804c'
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
      .style('font-size', 13)
      .style('cursor', 'pointer')

    node.append('title').text(option.name)

    node.append('circle')
      .attr('r', option.r)
      .style('fill', option.color)

    node.append('path')
      .attr('d', 'M 0,-8 V 0 H 8')
      .style('fill', 'none')
      .style('stroke', 'white')
      .style('stroke-width', 2)

    const text = node.append('text')
      .attr('y', 0)
      .style('user-select', 'none')
      .style('fill', 'white')

    const time = node.append('text')
      .attr('dy', '0.35em')
      .style('fill', 'white')
      .text(d => d.docIssueTime)

    if (option.i % 2 === 0) {
      time.attr('dx', -option.r - 10)
        .attr('text-anchor', 'end')

      text.selectAll('tspan').data(circleText(option.name, option.i))
        .enter()
        .append('tspan')
        .attr('x', option.r + 10)
        .attr('dx', d => d.dx)
        .attr('dy', d => d.dy)
        .attr('text-anchor', d => d.anchor)
        .text(d => d.text)
    } else {
      time.attr('dx', option.r + 10)
        .attr('text-anchor', 'start')

      text.selectAll('tspan').data(circleText(option.name, option.i))
        .enter()
        .append('tspan')
        .attr('x', -option.r - 10)
        .attr('dx', d => '-' + d.dx)
        .attr('dy', d => d.dy)
        .attr('text-anchor', d => d.anchor)
        .text(d => d.text)
    }
  },
  /**
   * 修改元素
   * @param {*} selection
   * @param {*} option
   */
  update(selection, option) {},
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
        color: '#4fbaf4'
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
      .attr('marker-end', 'url(#markerArrow)')
      .style('fill', 'none')
      .style('stroke', option.color)
  },
  /**
   * 修改元素
   * @param {*} selection
   * @param {*} option
   */
  update(selection, option) {},
  /**
   * 删除元素
   * @param {*} selection
   * @param {*} option
   */
  exit(selection, option) {
    selection.remove()
  }
}

// 节点文字
function circleText(text, i) {
  const anchor = i % 2 === 0 ? 'start' : 'end'
  if (!text) {
    return [{ text: '', dx: 0, dy: '0.35em', anchor: anchor }]
  }

  if (text.length <= 16) { // 一行
    return [
      { text: text, dx: 0, dy: '0.35em', anchor: anchor }
    ]
  }

  if (text.length <= 30) { // 二行
    return [
      { text: text.substring(0, 16), dx: 0, dy: '0.35em', anchor: anchor }, // 0.35 - 1 - 0.25
      { text: text.substring(16, 30), dx: '8em', dy: '1.5em', anchor: 'middle' }
    ]
  }

  if (text.length > 30) {
    return [
      { text: text.substring(0, 16), dx: 0, dy: '0.35em', anchor: anchor }, // 0.35 - 1 - 0.25
      { text: text.substring(16, 30) + '...', dx: '8em', dy: '1.5em', anchor: 'middle' }
    ]
  }
}
export {
  Nodes,
  Links
}
