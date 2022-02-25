import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// // Objects
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeMaterial = new THREE.MeshBasicMaterial({
//     color: '#ff0000',
// })
// const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cubeMesh)

// // move 
// cubeMesh.position.set(1,-0.8, 1)

// //rotation
// cubeMesh.rotation.reorder('YXZ')
// cubeMesh.rotation.x = Math.PI *0.25
// cubeMesh.rotation.y = Math.PI*0.25

// //scale
// cubeMesh.scale.x =2
// cubeMesh.scale.y =0.5
// cubeMesh.scale.z =0.5

// cubeMesh.scale.set(2,0.5,0.5)


//sphere
const sphereGeometry = new THREE.SphereGeometry( 1, 16,8 );
const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphereMesh = new THREE.Mesh(  sphereGeometry,sphereMaterial );
sphereMesh.position.x= 2
// scene.add( sphereMesh );

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.position.x = 1
scene.add(camera)
// camera.lookAt(cubeMesh.position)


//grouping

const group = new THREE.Group()
scene.add(group)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial( { color: 0xffff00 } )
)

group.add(cube)
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial( { color: 0xEFA900 } )
)

cube1.position.x =-2
group.add(cube1)
group.position.x=1
//helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
//light
// const directionalLight = new THREE.DirectionalLight( 0x00ffff, 0.5 );
// directionalLight.position.z =4
// directionalLight.position.y =3
// scene.add( directionalLight );
// directionalLight.target = cubeGeometry
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
function animate(){
	requestAnimationFrame(animate);
	group.rotation.x += 0.05;
	group.rotation.y += 0.01;

	renderer.render(scene, camera)
}


renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

animate();