const Data = {
  data: null,
  init(data) {
    this.data = JSON.parse(JSON.stringify(data))
  },
  getData() {
    return this.data
  },
  setData(data) {
    this.data = data
  },
  copyData(data) {
    data.links.forEach(d => {
      d.source = d.source.id ? d.source.id : d.source
      d.target = d.target.id ? d.target.id : d.target
    })
    return JSON.parse(JSON.stringify(data))
  },
  addData(oldData, newData) {
    oldData = this.copyData(oldData)

    const nids = new Set()
    const lids = new Set()
    oldData.nodes.forEach(d => {
      nids.add(d.id)
    })
    oldData.links.forEach(d => {
      lids.add(d.id)
    })

    newData.nodes.forEach(d => {
      if (!nids.has(d.id)) {
        oldData.nodes.push(d)
      }
    })
    newData.links.forEach(d => {
      if (!lids.has(d.id)) {
        oldData.links.push(d)
      }
    })
    this.data = oldData
    return oldData
  }
}

export default Data
