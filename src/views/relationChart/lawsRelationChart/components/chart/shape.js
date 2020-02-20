const Nodes = {
  default: {
    enter(selection, d) {
      const color = d.docState === 'running' ? '#4fbaf4' : '#b8b7b6'

      const option = {
        name: d.docName,
        time: d.docIssueTime,
        r: 10,
        color: color
      }

      if (d.queryNode === true) {
        option.color = '#ff804c'
        // option.r = 15
      }

      d.r = option.r
      Nodes.enter(selection, option)
    },
    update(selection, d) {
      const option = {
        r: 10,
        t: 1000
      }

      if (d.queryNode === true) {
        // option.r = 15
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

    const text = node.append('text')
      .attr('text-anchor', 'start')
      .style('user-select', 'none')
      // .style('pointer-events', 'none')
      .style('fill', 'white')

    text.selectAll('tspan').data(circleText(option.name, option.time))
      .enter()
      .append('tspan')
      .attr('x', option.r + 10)
      .attr('y', 0)
      .attr('dx', d => d.dx)
      .attr('dy', d => d.dy)
      .text(d => d.text)
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
        color: '#4fbaf4'
      }
      Links.enter(selection, option)
    },
    update(selection, d) {
      const option = {
        color: '#4fbaf4',
        t: 1000
      }
      Links.update(selection, option)
    },
    exit(selection, d) {
      const option = {
        color: '#4fbaf4',
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
    // link.append('text')
    //   .attr('dy', '-0.3em')
    //   .style('font-size', '14px')
    //   .style('user-select', 'none')
    //   .append('textPath')
    //   .attr('text-anchor', 'middle')
    //   .attr('startOffset', '50%')
    //   .attr('xlink:href', d => `#${d.id}`)
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
function circleText(text, text2) {
  if (!text) {
    return [{ text: text2, dx: 0, dy: '0.35em' }]
  }

  if (text.length <= 16) { // 一行
    return [
      { text: text, dx: 0, dy: '0.35em' },
      { text: text2, dx: 0, dy: '1.6em' }
    ]
  }

  if (text.length <= 30) { // 二行
    return [
      { text: text.substring(0, 16), dx: 0, dy: '-0.9em' }, // 0.35 - 1 - 0.25
      { text: text.substring(16, 30), dx: '2em', dy: '0.35em' },
      { text: text2, dx: 0, dy: '1.6em' } // 1 + 0.35 + 0.25
    ]
  }

  if (text.length > 30) {
    return [
      { text: text.substring(0, 16), dx: 0, dy: '-0.9em' }, // 0.35 - 1 - 0.25
      { text: text.substring(16, 30) + '...', dx: '2em', dy: '0.35em' },
      { text: text2, dx: 0, dy: '1.6em' } // 1 + 0.35 + 0.25
    ]
  }
}

export {
  Nodes,
  Links
}
