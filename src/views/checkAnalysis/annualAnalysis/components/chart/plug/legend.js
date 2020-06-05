import * as d3 from 'd3'

function legend(graph, id) {
  const width = graph.get('width')
  const height = 30
  const legends = {
    nodes: [
      { name: '近3年发布的政策', color: '#9EEA6A', translate: 'translate(0)' },
      { name: '3-5年未修订', color: '#4fbaf4', translate: 'translate(135)' },
      { name: '5-10年未修订', color: '#ff804c', translate: 'translate(237)' },
      { name: '10年以上未修订', color: 'red', translate: 'translate(347)' }
    ],
    links: [
      // { name: '被引用', color: '#4fbaf4', translate: 'translate(252)' }
    ]
  }

  const g = d3.select(`#${id}`)
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('border-top', '#ccc 1px solid')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('margin-bottom', '-3px')
    .style('background-color', 'white')
    .append('g')
    .style('font-size', '13px')

  // add Node
  const nodeg = g.selectAll('g.node').data(legends.nodes).enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => d.translate)

  nodeg.append('circle')
    .attr('r', 6)
    .style('fill', d => d.color)

  nodeg.append('text')
    .attr('dx', 15)
    .attr('dy', 4)
    .text(d => d.name)

  // add Link
  const linkg = g.selectAll('g.link').data(legends.links).enter()
    .append('g')
    .classed('link', true)
    .attr('transform', d => d.translate)

  linkg.append('path')
    .attr('d', 'M 0,2 L10,2 L10,6 L16,0 L10,-6 L10,-2 L0,-2 Z')
    .style('fill', d => d.color)

  linkg.append('text')
    .attr('dx', 25)
    .attr('dy', 4)
    .text(d => d.name)

  const gWidth = g.node().getBBox().width
  g.attr('transform', `translate(${(width - gWidth) / 2}, ${height / 2})`)
}
export default legend
