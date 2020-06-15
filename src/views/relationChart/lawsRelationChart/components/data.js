let docDomainType = []
let nodeMap = null
let parent = null
let children = null

function isDocType(link) {
  const source = nodeMap.get(link.source)
  if (source.docType) {
    return arrayInArray(source.docType.split(';'), ['通知公告', '专家解读', '招标信息'])
  }
  return false
}

function isRevise(link) {
  const source = nodeMap.get(link.source)
  if (source.docType) {
    return arrayInArray(source.docType.split(';'), ['法律修订', '政策修订'])
  }
  return false
}

function isDocDomainType(link) {
  const source = nodeMap.get(link.source)
  if (source.docDomainType) {
    return arrayInArray(source.docDomainType.split(';'), docDomainType)
  }
  return false
}

function arrayInArray(source, target) {
  let isSel = false
  const set = new Set(target)
  source.forEach(d => {
    isSel = isSel || set.has(d)
  })
  return isSel
}

export function handleData(data, id) {
  const nodes = data.nodes
  const links = data.links

  nodeMap = new Map()
  parent = new Map()
  children = new Map()

  // 处理处理
  nodes.forEach(d => {
    nodeMap.set(d.id, d)
  })
  links.forEach(d => {
    if (parent.has(d.target)) {
      parent.get(d.target).push(d)
    } else {
      parent.set(d.target, [d])
    }

    if (children.has(d.source)) {
      children.get(d.source).push(d)
    } else {
      children.set(d.source, [d])
    }
  })
  docDomainType = nodeMap.get(id).docDomainType.split(';')
  const nodeSet = new Set()
  const linkSet = new Set()

  // 向上寻找
  let nexts = [id]
  while (nexts.length > 0) {
    const arr = []
    nexts.forEach(d => {
      nodeSet.add(d)
      if (children.has(d)) {
        children.get(d).forEach(link => {
          const key = link.source + '##' + link.target
          arr.push(link.target)
          linkSet.add(key)
        })
      }
    })
    nexts = arr
  }

  // 向下剪枝
  nexts = Array.from(nodeSet)
  while (nexts.length > 0) {
    const arr = []
    nexts.forEach(d => {
      nodeSet.add(d)
      if (parent.has(d)) {
        parent.get(d).forEach(link => {
          const key = link.source + '##' + link.target
          let flag = true
          flag = !linkSet.has(key)
          // 1. 同类型判断docDomainType
          if (flag) {
            flag = flag && isDocDomainType(link)
          }
          // 2. 修订剔除 doc_type
          if (flag) {
            flag = flag && !isRevise(link)
          }
          // 3. 通知、解读、批复类的附加 doc_type
          if (isDocType(link)) {
            nodeSet.add(link.source)
            linkSet.add(key)
            flag = false
          }
          if (flag) {
            arr.push(link.source)
            linkSet.add(key)
          }
        })
      }
    })
    nexts = arr
  }

  nodes.forEach(d => {
    d.isShow = nodeSet.has(d.id)
  })
  links.forEach(d => {
    d.isShow = linkSet.has(d.source + '##' + d.target)
  })
}
