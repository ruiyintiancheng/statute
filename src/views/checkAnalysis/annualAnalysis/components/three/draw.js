const THREE = window.THREE
/**
 * 创建场景对象Scene  网格模型 mesh -- 光照 light
 */
export function getGroupBar(data) {
  const group = new THREE.Group()
  group.name = 'nodes'
  /**
     * 创建网格模型
     */
  for (let i = 0; i < data.length; i++) {
    const x = data[i].x
    const y = data[i].y
    const z = data[i].z
    const w = data[i].w
    const h = data[i].h
    const color = data[i].color
    // 创建一个六面体几何对象
    var geometry = new THREE.BoxGeometry(w, h, w)
    var material = new THREE.MeshLambertMaterial({
      color
    })
    // if (i === 0) {
    //   console.log(geometry);
    //   console.log('几何体顶点位置数据',geometry.attributes);
    //   console.log('几何体索引数据',geometry.index);
    // }

    // 网格模型对象Mesh
    var mesh = new THREE.Mesh(geometry, material)
    // 设置mesh模型对象的xyz坐标为120,0,0
    mesh.position.set(x + (w / 2), y + (h / 2), z + (w / 2))
    mesh.name = 'node'
    mesh.userData = data[i]
    // 网格模型添加到场景中
    group.add(mesh)
  }
  return group
}

// 绘制坐标系
export function drawGrid(cfg) {
  const group = new THREE.Group()

  const xs = cfg.xSize || 10 // x轴尺寸
  const xd = cfg.xDivisions || 10 // x轴细分数
  const ys = cfg.ySize || 10 // y轴尺寸
  const yd = cfg.yDivisions || 10 // y轴系分数
  const zs = cfg.zSize || 10 // z轴尺寸
  const zd = cfg.zDivisions || 10 // z轴系分数
  const color = cfg.color || 0x000000 // 网格颜色
  const dx = xs / xd
  const dy = ys / yd
  const dz = zs / zd

  // 创建一个线条基本材质
  var material = new THREE.LineBasicMaterial({ color: color })
  // 绘制X--Y平面
  if (cfg.xSize && cfg.ySize) {
    // Vector 是三维矢量，参数理解为为x,y,z坐标
    // 绘制x轴线
    for (let i = 0; i <= yd; i++) {
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(0, i * dy, 0))
      geometry.vertices.push(new THREE.Vector3(xs, i * dy, 0))
      group.add(new THREE.Line(geometry, material))
    }

    // 绘制y轴线
    for (let i = 0; i <= xd; i++) {
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(i * dx, 0, 0))
      geometry.vertices.push(new THREE.Vector3(i * dx, ys, 0))
      group.add(new THREE.Line(geometry, material))
    }
  }

  // 绘制X--Z平面
  if (cfg.xSize && cfg.ySize) {
    // Vector 是三维矢量，参数理解为为x,y,z坐标
    // 绘制x轴线
    for (let i = 0; i <= zd; i++) {
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(0, 0, i * dz))
      geometry.vertices.push(new THREE.Vector3(xs, 0, i * dz))
      group.add(new THREE.Line(geometry, material))
    }

    // 绘制z轴线
    const dx = xs / xd
    for (let i = 0; i <= xd; i++) {
      var geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(i * dx, 0, 0))
      geometry.vertices.push(new THREE.Vector3(i * dx, 0, zs))
      group.add(new THREE.Line(geometry, material))
    }
  }

  // 绘制Y--Z平面
  if (cfg.xSize && cfg.ySize) {
    // Vector 是三维矢量，参数理解为为x,y,z坐标
    // 绘制y轴线
    for (let i = 0; i <= zd; i++) {
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(0, 0, i * dz))
      geometry.vertices.push(new THREE.Vector3(0, ys, i * dz))
      group.add(new THREE.Line(geometry, material))
    }

    // 绘制z轴线
    for (let i = 0; i <= yd; i++) {
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(0, i * dy, 0))
      geometry.vertices.push(new THREE.Vector3(0, i * dy, zs))
      group.add(new THREE.Line(geometry, material))
    }
  }
  return group
}

function createSpriteText(text) {
  // 先用画布将文字画出
  const canvas = document.createElement('canvas')
  canvas.width = 500
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffff00'
  ctx.font = '80px Arial'
  ctx.lineWidth = 4
  ctx.fillText(text, 0, 90)
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  // 使用Sprite显示文字
  const material = new THREE.SpriteMaterial({ map: texture })
  const textObj = new THREE.Sprite(material)
  return textObj
}

export function drawGridText(cfg) {
  const x = cfg.x
  // const y = cfg.y
  const z = cfg.z

  const xTick = cfg.xTick
  const yTick = cfg.yTick
  const zTick = cfg.zTick

  const group = new THREE.Group()

  // 绘制x轴文字
  xTick.forEach(d => {
    const textObj = createSpriteText(d.text)
    textObj.position.set(d.position + 10, -15, z + 20)
    textObj.scale.set(40, 20, 1)
    group.add(textObj)
  })

  // 绘制y轴文字
  yTick.forEach(d => {
    const textObj = createSpriteText(d.text)
    textObj.position.set(x + 30, d.position, -15)
    textObj.scale.set(40, 20, 1)
    group.add(textObj)
  })

  // 绘制z轴文字
  zTick.forEach(d => {
    const textObj = createSpriteText(d.text)
    textObj.scale.set(40, 20, 1)
    textObj.position.set(x + 30, -15, d.position)
    group.add(textObj)
  })

  return group
}
