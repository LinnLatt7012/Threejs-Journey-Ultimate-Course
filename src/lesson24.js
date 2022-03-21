import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ToneMapping } from 'three'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 200
})
const debugObject={}
//Canvas
const canvas = document.querySelector('canvas.webgl')
//Helper

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//Texture
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap= cubeTextureLoader.setPath( 'textures/environmentMaps/3/' )
.load( [
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
])
const flagTexture = textureLoader.load('/textures/flag-french.jpg')

/**
 * Models
 */

/** 
 * Lights
 */

//Directional Light 
const directionalLight = new THREE.DirectionalLight(0xffffff,3)
directionalLight.position.set(2,2,0)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.mapSize.set(1024,1024)
// directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('LightIntensity')
gui.add(directionalLight.position,'x').min(0).max(10).step(0.001).name('LightX')
gui.add(directionalLight.position,'y').min(0).max(10).step(0.001).name('LightY')
gui.add(directionalLight.position,'z').min(0).max(10).step(0.001).name('LightZ')

// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 1
// camera.position.y = 4

scene.add(camera)

//Controls

const controls = new OrbitControls(camera,canvas)
// controls.enabled = false
controls.enableDamping =true
controls.update()
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

//Renderer 
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

//Object
const gemoetry = new THREE.PlaneBufferGeometry(1,1,32,32)
const count = gemoetry.attributes.position.count
const randoms = new Float32Array(count)
for (let i = 0; i < count; i++) {
    randoms[i] = Math.random() 
}

gemoetry.setAttribute('aRandom',new THREE.BufferAttribute(randoms,1))
// console.log(count);
const plane = new THREE.Mesh(
    gemoetry,
    new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        transparent:true,
        uniforms:{
            uFrequency: {value: new THREE.Vector2(10,5)},
            uTime:{value: 0},
            uColor:{value: new THREE.Color('orange')},
            uTexture: {value: flagTexture}
        }
        // wireframe:true,
    })
)
gui.add(plane.material.uniforms.uFrequency.value,'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(plane.material.uniforms.uFrequency.value,'y').min(0).max(20).step(0.01).name('frequencyY')
// plane.rotation.x = - Math.PI * 0.4999
plane.scale.y = 2/3
scene.add(plane)
renderer.render(scene, camera)

/**
 * shadows
 */
directionalLight.castShadow = true

//Animate
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    //material 
    plane.material.uniforms.uTime.value = elapsedTime
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

/**
 * Note
 * 
 * 
 */


