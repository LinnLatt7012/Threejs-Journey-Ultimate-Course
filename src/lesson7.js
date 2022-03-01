import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Canvas
const cursor ={
    x:0,
    y:0
}
const canvas = document.querySelector('canvas.webgl')
window.addEventListener('mousemove', (event)=>{
    // console.log(`y`, event.clientY );
    cursor.x= event.clientX/ sizes.width - 0.5;
    cursor.y = event.clientY/ sizes.height - 0.5;
})      
// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Objects
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1,5,5,5)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000',
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)
// Camera
// near and far is to define how much camera can seee and render
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
const aspect = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspect,1 *aspect,1 ,-1,0.1, 100)
camera.position.z = 3
scene.add(camera)
// camera.lookAt(cube.position)

//Controls

const controls = new OrbitControls(camera,canvas)
controls.target.y = 1;
controls.update()

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const tick =() =>{
	renderer.render(scene, camera)
    // camera.position.x =Math.sin(cursor.x *Math.PI * 2)  * 3
    // camera.position.z =Math.cos(cursor.x *Math.PI * 2)  * 3
    // camera.position.y = cursor.y * -5
    // // cube.rotation.y += 0.01
    // camera.lookAt(cube.position)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()