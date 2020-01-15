const Nodes = {
  default: {
    enter(selection, d) {
      let color = d.docState === 'running' ? 'green' : 'gray'
      if (d.queryNode === true) {
        color = 'red'
      }
      const option = {
        name: d.docName,
        r: 10,
        color: color,
        texts: [
          { title: '法规名称', value: d.docName },
          { title: '发布时间', value: d.docIssueTime }
        ]
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
      .style('font-size', 12)
      .style('cursor', 'pointer')

    node.append('title').text(option.name)

    node.append('circle')
      .attr('r', option.r)
      .style('fill', option.color)

    // const text = node.append('text')
    //   // .attr('text-anchor', 'middle')
    //   .style('user-select', 'none')
    //   .style('pointer-events', 'none')
    //   .style('fill', 'black')
    node.append('text')
      .attr('x', option.r + 10)
      .attr('dy', '0.35em')
      .style('fill', 'black')
      .text(d => d.docName)

    node.append('text')
      .attr('x', -option.r - 10)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .style('fill', 'black')
      .text(d => d.docIssueTime)
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

// 圆内文字
// function circleText(text) {
//   if (!text) {
//     return { 'text': '', 'x': 0, 'y': 0 }
//   }

//   if (text.length <= 10) { // 一行
//     return [{ 'text': text, 'dy': '0.5em' }]
//   }

//   if (text.length <= 20) { // 二行
//     return [
//       { 'text': text.substring(0, 10), 'dy': '0' },
//       { 'text': text.substring(10, 20), 'dy': '1em' }
//     ]
//   }

//   if (text.length <= 30) { // 三行
//     return [
//       { 'text': text.substring(0, 10), 'dy': '-0.5em' },
//       { 'text': text.substring(10, 20), 'dy': '0.5em' },
//       { 'text': text.substring(20, 30), 'dy': '1.5em' }
//     ]
//   }

//   if (text.length > 30) {
//     const length = text.length / 3
//     return [
//       { 'text': text.substring(0, length), 'dy': '-0.5em' },
//       { 'text': text.substring(length, length * 2), 'dy': '0.5em' },
//       { 'text': text.substring(length * 2, text.length), 'dy': '1.5em' }
//     ]
//   }
// }
export {
  Nodes,
  Links
}
