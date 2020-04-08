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
  conversionData(newData) {
    let array = []
    newData.forEach(d => {
      array = array.concat(d.data)
    })
    return array
  }
}

export default Data
