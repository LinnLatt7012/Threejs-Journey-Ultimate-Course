import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 200
})

//Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//Texture
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap= cubeTextureLoader.setPath( 'textures/environmentMaps/0/' )
.load( [
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
] )

//Model 
const dracoLoader = new DRACOLoader() //Draco file are much lighter like 2+ times less
dracoLoader.setDecoderPath('/draco/')
const gltflLoader =  new GLTFLoader()
gltflLoader.setDRACOLoader(dracoLoader)
gltflLoader.load(
    '/model'
)
//Object
const testSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(),
    new THREE.MeshStandardMaterial({
    })
)
scene.add(testSphere)

/** 
 * Lights
 */
//Directional Light 
const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
directionalLight.position.set(2,2,-1)
scene.add(directionalLight)

gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('LightIntensity')
gui.add(directionalLight.position,'x').min(0).max(10).step(0.001).name('LightX')
gui.add(directionalLight.position,'y').min(0).max(10).step(0.001).name('LightY')
gui.add(directionalLight.position,'z').min(0).max(10).step(0.001).name('LightZ')

// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 10

scene.add(camera)

//Controls

const controls = new OrbitControls(camera,canvas)
// controls.enabled = false
controls.enableDamping =true
controls.update()
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

//Renderer 
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.physicallyCorrectLights = true
renderer.render(scene, camera)

/**
 * shadows
 */
// directionalLight.castShadow = true

//Animate
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()

//Event
window.addEventListener('resize', (event)=>{
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
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if(!fullscreenElement){
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

camera.position.y = 4