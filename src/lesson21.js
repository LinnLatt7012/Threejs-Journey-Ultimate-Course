import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import * as dat from 'dat.gui'


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
/** 
 * Lights
 */

//Ambient Light 
const  ambientLight =  new THREE.AmbientLight('#ffffff',0.5 )
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
directionalLight.position.set(2,2,-1)
scene.add(directionalLight)

/**
 * Models
 */
const dracoLoader = new DRACOLoader() //Draco file are much lighter like 2+ times less
dracoLoader.setDecoderPath('/draco/')
const gltflLoader =  new GLTFLoader()
gltflLoader.setDRACOLoader(dracoLoader)
const helment =  new THREE.Group()
let mixer  = null;
// scene.add(helment)
// gltflLoader.load(
//     '/models/Fox/glTF/Fox.gltf',
//     (gltf)=>{
//         mixer  = new THREE.AnimationMixer(gltf.scene)
//         const action = mixer.clipAction(gltf.animations[0])
//         action.play()
//         gltf.scene.scale.set(0.025,0.025,0.025)
//         scene.add(gltf.scene)

//         //Array of mesh
//         // helment.add(...gltf.scene.children)
        
//         // while(gltf.scene.children.length){
//         //     gltf.scene.children[0].castShadow = true
//         //     helment.add(gltf.scene.children[0])
//         // }
//     },
// )
gltflLoader.load(
    '/models/hamburger.glb',
    (gltf)=>{
        gltf.scene.scale.set(0.25,0.25,0.25)
        scene.add(gltf.scene)
    }
)
// gltflLoader.load(
//     '/models/Duck/glTF-Draco/Duck.gltf',
//     (gltf)=>{
//         scene.add(gltf.scene.children[1])
//     },
// )




helment.castShadow =true

//Object
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10,10,32,32),
    new THREE.MeshStandardMaterial({
        envMap:environmentMap,
        roughness: 0.8,
        metalness: 0.5,
 })
)
floor.rotation.x = - Math.PI * 0.4999
scene.add(floor)
// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 10
camera.position.y = 4

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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

/**
 * shadows
 */
directionalLight.castShadow = true
floor.receiveShadow = true


const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //Update minxer
    if(mixer){
        mixer.update(deltaTime)
    }


    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()