import data from './data.json'

export function handleData(type) {
  const result = []
  if (type === 'year') {
    const map = new Map()
    data.forEach(d => {
      const key = d.year + '##' + d.docSys

      if (map.has(key)) {
        const line = map.get(key)
        line.count += 1
      } else {
        map.set(key, {
          year: d.year,
          docSys: d.docSys,
          count: 1
        })
      }
    })

    map.forEach(value => {
      result.push(value)
    })
  }

  if (type === '1') {
    return [
      { year: 2000, docSys: '具体政策', count: 10 },
      { year: 2010, docSys: '具体政策', count: 30 },
      { year: 2020, docSys: '其它', count: 50 }
    ]
  }
  return result
}

// {
//   "docContentSys": "其他",
//   "docNum": "",
//   "docName": "社会团体登记暂行办法",
//   "docIssueOrgText": "中华人民共和国中央人民政府政务院",
//   "month": 10,
//   "docIssueTime": "1950-10-19",
//   "year": 1950,
//   "fuseField": "国防科技工业武器装备领域;军民科技协同创新领域;军队保障社会化领域;重大安全领域;统筹应急应战公共安全领域;军地人力资源开发领域;基础设施共建共享领域",
//   "timeType": 4,
//   "docAnnulTime": "1989-10-25",
//   "docSys": "基础政策",
//   "id": 501220
// },
