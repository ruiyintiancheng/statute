import * as d3 from 'd3-scale'
const grid = 60

const x = d3.scaleLinear()
const y = d3.scaleLinear()

export function layout(cfg, data) {
  // const gridWidth = cfg.gridWidth
  const gridHeight = cfg.gridHeight
  const time = []
  let maxCount = 0

  const map = new Map()

  data.forEach(d => {
    d.year = parseInt(d.year)
    const key = d.year
    if (map.has(key)) {
      map.get(key).push(d)
    } else {
      map.set(key, [d])
    }
  })
  const result = []

  map.forEach((value, key) => {
    const line = {}
    line.year = key
    line.newSituaTask = 0
    line.other = 0

    value.forEach(d => {
      if (d.newSituaTask === '是') {
        line.newSituaTask = d.count
      }
      if (d.newSituaTask === '否') {
        line.other = d.count
      }
      line.year = d.year
    })

    result.push(line)

    if (!time[0] || time[0] > key) {
      time[0] = key
    }
    if (!time[1] || time[1] < key) {
      time[1] = key
    }
    const count = line.newSituaTask + line.other
    if (count > maxCount) {
      maxCount = count
    }
  })

  time[0] = time[0] - 1
  time[1] = time[1] + 1

  x.domain(time)
    .range([0, (time[1] - time[0]) * grid])

  y.domain([0, maxCount])
    .range([0, gridHeight])

  result.forEach(d => {
    d.x = x(d.year)
    d.taskH = y(d.newSituaTask)
    d.otherH = y(d.other)
  })
  cfg.xScale = x
  cfg.yScale = y
  cfg.time = time
  cfg.maxCount = maxCount
  cfg.chart_width = (time[1] - time[0]) * grid
  return result
}
