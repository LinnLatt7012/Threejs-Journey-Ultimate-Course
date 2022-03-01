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
// window.addEventListener('mousemove', (event)=>{
//     // console.log(`y`, event.clientY );
//     cursor.x= event.clientX/ sizes.width - 0.5;
//     cursor.y = event.clientY/ sizes.height - 0.5;
// })      
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', (event)=>{
    // console.log(`y`, event.clientY );
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    //render
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})   

window.addEventListener('dblclick',()=>{
    // console.log('here');
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    // because document.fullscreenElement isn't work in safari
    console.log(fullscreenElement);
    
    if(!fullscreenElement){
        console.log('here1');
       if(canvas.requestFullscreen){
            canvas.requestFullscreen()
       }else if(canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
       }
    }
    else{
        if(document.exitFullscreen){
            document.exitFullscreen()
        }else if(document.webkitExitFullscreen){
            document.exitFullscreen()
        }
    }
})
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
controls.enabled = false
controls.enableDamping =true
controls.update()

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

renderer.render(scene, camera)

const tick =() =>{

	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()
