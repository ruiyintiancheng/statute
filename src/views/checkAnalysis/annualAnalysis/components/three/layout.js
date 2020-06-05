import * as d3 from 'd3-scale'
const grid = 20

const x = d3.scaleLinear()
const y = d3.scaleLinear()

function getZ(val) {
  if (val === '是') {
    return 80
  }
  return 0
}

function getColor(val) {
  const date = new Date()
  const y = date.getFullYear()
  if (val > y - 3) {
    return '#9EEA6A'
  }
  if (val <= y - 3 && val > y - 5) {
    return '#4fbaf4'
  }
  if (val <= y - 5 && val > y - 10) {
    return '#ff804c'
  }
  return '#ff0000'
}

export function getCfg() {
  const xDivisions = x.range()[1] * 2 + 1
  return {
    xSize: xDivisions * grid,
    xDivisions,
    ySize: y.range()[1],
    yDivisions: 4,
    zSize: 5 * grid,
    zDivisions: 5,
    color: '#CCCCCC'
  }
}

export function getGridTextCfg() {
  const xTick = []
  const domain = x.domain()
  for (let i = domain[0]; i <= domain[1]; i++) {
    xTick.push({ position: x(i) * grid * 2, text: i })
  }
  const yTick = []
  const dy = parseInt(y.domain()[1] / 4)
  for (let i = 0; i <= 4; i++) {
    yTick.push({ position: y(i * dy), text: i * dy })
  }

  const zTick = []
  zTick.push({ position: getZ('是'), text: '新形式新任务' })
  zTick.push({ position: getZ('否'), text: '其它' })

  return {
    x: (x.range()[1] * 2 + 1) * grid,
    y: 4 * 50,
    z: 5 * grid,
    xTick: xTick,
    yTick: yTick,
    zTick: zTick
  }
}

export function layout(cfg, data) {
  const time = []
  let maxCount = 0
  data.forEach(d => {
    if (!time[0] || time[0] > d.year) {
      time[0] = d.year
    }
    if (!time[1] || time[1] < d.year) {
      time[1] = d.year
    }
    if (d.count > maxCount) {
      maxCount = d.count
    }
  })
  x.domain([time[0], time[1]])
    .range([0, time[1] - time[0]])

  y.domain([0, maxCount])
    .range([0, cfg.height / 3])

  data.forEach((d, i) => {
    d.x = x(d.year) * grid * 2
    d.y = 0
    d.z = getZ(d.newSituaTask)
    d.w = grid
    d.h = y(d.count)
    d.color = getColor(d.year)
  })
}
