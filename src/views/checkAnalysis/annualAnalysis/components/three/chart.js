import { layout, getCfg, getGridTextCfg } from './layout.js'
import { drawGrid, getGroupBar, drawGridText } from './draw.js'
const THREE = window.THREE

let width = 100
let height = 100
let cfg = {}
// 创建场景对象
const scene = new THREE.Scene()

// 创建相机对象
let camera = null

// 创建渲染对象
var renderer = new THREE.WebGLRenderer()

let controls = null

function clear() {
  for (let i = 0; i < scene.children.length;) {
    const obj = scene.children[i]
    obj.parent = null
    scene.children.splice(i, 1)
  }
}

function render() {
  // scene.rotateY(Math.PI);
  renderer.render(scene, camera)// 执行渲染操作
  //  controls.update();
  // scene.rotateX(0.01);//每次绕y轴旋转0.01弧度
  // scene.rotateY(0.01);//每次绕y轴旋转0.01弧度
  // scene.rotateZ(0.01);//每次绕y轴旋转0.01弧度
  // requestAnimationFrame(render);//请求再次执行渲染函数render
}

function draw(data) {
  const cfg = getCfg()
  // 绘制网格
  scene.add(getGroupBar(data))
  scene.add(drawGrid(cfg))
  scene.add(drawGridText(getGridTextCfg()))

  // 光源设置
  // 点光源
  var point = new THREE.PointLight(0xffffff)
  point.position.set(cfg.xSize, cfg.ySize, cfg.zSize) // 点光源位置
  scene.add(point) // 点光源添加到场景中
  // 环境光
  var ambient = new THREE.AmbientLight(0x888888)
  scene.add(ambient)

  // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
  // var axisHelper = new THREE.AxisHelper(250)
  // scene.add(axisHelper)

  if (cfg.xSize < width) {
    camera.position.set(cfg.xSize - 50, 161, 176)
    controls.target = new THREE.Vector3(cfg.xSize, 0, -82)
  } else {
    camera.position.set(cfg.xSize - width / 4 - 50, 161, 176)
    controls.target = new THREE.Vector3(cfg.xSize - width / 4, 0, -82)
  }
  controls.update()
  // camera.position.set(300, 300, 200)
  // camera.lookAt(scene.position)
  render()
}

// 加载事件
function loadEvent() {
  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)// 监听鼠标、键盘事件
  // 声明raycaster和mouse变量
  var raycaster = new THREE.Raycaster()
  var mouse = new THREE.Vector2()

  // renderer.domElement.addEventListener('click', onMouseClick, false)
  document.querySelector(cfg.container).addEventListener('mousemove', onMousemove)
  document.querySelector(cfg.container).addEventListener('click', onMouseClick, false)

  // 鼠标移动事件
  function onMousemove(event) {
    const objs = scene.getObjectByName('nodes')
    if (!objs || !objs.children) {
      return
    }
    const obj = findObj(event, mouse, raycaster, objs.children)
    if (obj) {
      const data = obj.userData
      const point = eventPoint(event, renderer.domElement)
      cfg.nodeMove({
        x: point.x,
        y: point.y,
        year: data.year,
        count: data.count,
        newSituaTask: data.newSituaTask
      })
    } else {
      cfg.nodeMove()
    }
  }

  // 鼠标点击事件
  function onMouseClick(event) {
    const objs = scene.getObjectByName('nodes')
    if (!objs || !objs.children) {
      return
    }
    const obj = findObj(event, mouse, raycaster, objs.children)
    if (obj) {
      cfg.nodeClick(obj.userData)
    }
  }
}

function findObj(event, mouse, raycaster, objs) {
  const point = eventPoint(event, renderer.domElement)
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  mouse.x = (point.x / renderer.domElement.clientWidth) * 2 - 1
  mouse.y = -(point.y / renderer.domElement.clientHeight) * 2 + 1
  // console.log(event)
  // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
  raycaster.setFromCamera(mouse, camera)
  // 获取raycaster直线和所有模型相交的数组集合
  var intersects = raycaster.intersectObjects(objs, true)
  // 将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
  for (var i = 0; i < intersects.length; i++) {
    return intersects[ i ].object
  }
}

function eventPoint(event, element) {
  const mouseX = event.clientX
  const mouseY = event.clientY
  const top = element.getBoundingClientRect().top
  const left = element.getBoundingClientRect().left
  return {
    x: mouseX - left,
    y: mouseY - top
  }
}

/** 设置配置信息 */
export function setCfg(config) {
  cfg = config
  // console.log('cfg', cfg)
  // cfg = this.cfg
  width = cfg.width || 100
  height = cfg.height || 100
  const background = cfg.background || '#ffffff'
  const container = cfg.container

  const k = width / height // 窗口宽高比
  const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大
  // 创建相机对象
  camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
  // new THREE.OrthographicCamera();
  // camera.left = -s * k; // 摄像机视锥体左侧面。
  // camera.right = s * k;  // 摄像机视锥体右侧面。
  // camera.top  = s;  // 摄像机视锥体上侧面。
  // camera.bottom = -s; // 摄像机视锥体下侧面。
  // camera.near = 1; // 摄像机视锥体近端面。
  // camera.far = 1000; // 摄像机视锥体远端面。

  renderer.setSize(width, height)// 设置渲染区域尺寸
  renderer.setClearColor(background, 1) // 设置背景颜色
  document.querySelector(container).appendChild(renderer.domElement)

  loadEvent()
}

// 加载数据
export function data(data) {
  layout(cfg, data)
  clear()
  draw(data)
}

