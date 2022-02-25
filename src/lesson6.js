import './style.css'
import * as THREE from 'three'
import { Vector3 } from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Objects
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000',
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

scene.add(camera)
// camera.lookAt(cube.position)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

gsap.to(cube.position, { duration: 1,delay: 1, x: 2 })
gsap.to(cube.position, { duration: 2,delay: 2, x: -2 })
gsap.to(cube.position, { duration: 1,delay: 4, x: 0 })
//animations
 
// let time = Date.now()
// function tick(){
    
//     //Time
//     const currentTime = Date.now()
//     const deltaTime = currentTime-time;
//     time = currentTime;
    
//     // console.log(`deltaTime`, deltaTime);

// 	requestAnimationFrame(tick);// calling next frame, telling what to do in that frame

//     //update objects
// 	cube.rotation.x += 0.001 * deltaTime;// this is will keep animation have same level of speed regardless of the FPS computer running
// 	cube.rotation.y += 0.001 * deltaTime;

//     //render
// 	renderer.render(scene, camera)
// }

//using clock
const clock = new THREE.Clock()
const tick =() =>{
    
    //Time
    const elapsedTime =  clock.getElapsedTime()
    // console.log(elapsedTime);
    
    //update objects
    // cube.position.z = Math.sin(elapsedTime); //this is will keep animation have same level of speed regardless of the FPS computer running
    // cube.position.x =  Math.cos(elapsedTime);
    
    //render
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}


// setInterval(()=>{
//     cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;
//     //render
// 	renderer.render(scene, camera)
// }, 16.5)

tick()