var THREE = require('three')
var World = require('three-world')

var mouse = new THREE.Vector3()
var raycaster = new THREE.Raycaster()

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
  new THREE.BoxGeometry(20, 1, 20),
  new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5})
)
World.add(box)

World.start()

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
    box.position.divideScalar(10).floor().multiplyScalar(10).addScalar(10)
    box.position.setY(0)
  }
})
