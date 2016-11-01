var THREE = require('three')
var World = require('three-world')

window.THREE = THREE

var mouse = new THREE.Vector3()
var raycaster = new THREE.Raycaster()
var isScaling = false, dragOrigin = new THREE.Vector3()

// Allow cross-origin texture loading
THREE.ImageUtils.crossOrigin = ''

function render () {
}

World.init({camDistance: 100, renderCallback: render})
var cam = World.getCamera()
cam.position.set(0, 100, 100)
cam.rotation.set(-Math.PI / 4, 0, 0)

var plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 10, 10),
  new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
)
plane.rotation.set(-Math.PI / 2, 0, 0)
World.add(plane)

var box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 1, 10),
  new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5})
)
World.add(box)

World.start()

window.addEventListener('mousedown', function (event) {
  mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    (event.clientY / window.innerHeight) * -2 + 1
  )
  raycaster.setFromCamera(mouse, cam)
  var intersects = raycaster.intersectObjects([plane])
  if (intersects.length > 0) {
    var intersect = intersects[0]
    var pos = new THREE.Vector3().copy(intersect.point).add(intersect.face.normal)
    pos.divideScalar(10).floor().multiplyScalar(10).addScalar(10)
    pos.setY(0)
    console.log('Clicked at', pos)
    if(!isScaling) {
      isScaling = true
      dragOrigin.copy(pos)
    }
  }

})

window.addEventListener('mouseup', function(event) {
  if(!isScaling) return

  mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    (event.clientY / window.innerHeight) * -2 + 1
  )
  raycaster.setFromCamera(mouse, cam)
  var intersects = raycaster.intersectObjects([plane])
  if (intersects.length > 0) {
    var intersect = intersects[0]
    var pos = new THREE.Vector3().copy(intersect.point).add(intersect.face.normal)
    pos.divideScalar(10).floor().multiplyScalar(10).addScalar(10)
    pos.setY(0)
    var scale = new THREE.Vector3().copy(pos).sub(dragOrigin).setY(10)
    if(scale.x === 0) scale.x = 10
    if(scale.z === 0) scale.z = 10
    console.log('Scale is:', scale)

    var thing = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}))
    thing.scale.copy(scale)
    thing.position.copy(pos.sub(scale.setY(-10).divideScalar(2)))
    World.add(thing)
    window.thing = thing
  }

  console.log('drag ended')
  isScaling = false
})

window.addEventListener('mousemove', function (event) {
  mouse.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    (event.clientY / window.innerHeight) * -2 + 1
  )
  raycaster.setFromCamera(mouse, cam)
  var intersects = raycaster.intersectObjects([plane])
  if (intersects.length > 0) {
    var intersect = intersects[0]
    box.position.copy(intersect.point).add(intersect.face.normal)
    box.position.divideScalar(10).round().multiplyScalar(10).addScalar(-5)
    box.position.setY(0)
  }
})
