import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ToneMapping } from 'three'

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
const updateAllMaterials = () => {
    scene.traverse((child) =>{
        // console.log(child);
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // child.material.envMap =  environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow= true
        }
    })
}
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
] )
environmentMap.encoding =  THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject,'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
//Loaded
const dracoLoader = new DRACOLoader() //Draco file are much lighter like 2+ times less
dracoLoader.setDecoderPath('/draco/')
const gltflLoader =  new GLTFLoader()
gltflLoader.setDRACOLoader(dracoLoader)

/**
 * Models
 */
// FlightHelmet/glTF/FlightHelmet.gltf

// gltflLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) =>{
//         gltf.scene.scale.set(10,10,10)
//         gltf.scene.position.set(0,-4,0)
//         gltf.scene.rotation.y = -Math.PI * 0.5
//         scene.add(gltf.scene)

//         gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')

//         updateAllMaterials()
//     },
//     ()=>{console.log('process')},
//     ()=>{console.log('error')}
// )

// Hamburger
gltflLoader.load(
    '/models/hamburger.glb',
    (gltf) =>{
        gltf.scene.scale.set(0.3,0.3,0.3)
        gltf.scene.position.set(0,-1,0)
        gltf.scene.rotation.y = -Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
    },
    ()=>{console.log('process')},
    ()=>{console.log('error')}
)

//Object
const testSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1,32,32),
    new THREE.MeshStandardMaterial({})
)
// scene.add(testSphere)

/** 
 * Lights
 */
//Directional Light 
const directionalLight = new THREE.DirectionalLight(0xffffff,3)
directionalLight.position.set(2,2,0)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// const directionalLightCameraHelper =  new THREE.CameraHelper(directionalLight.shadow.camera)

gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('LightIntensity')
gui.add(directionalLight.position,'x').min(0).max(10).step(0.001).name('LightX')
gui.add(directionalLight.position,'y').min(0).max(10).step(0.001).name('LightY')
gui.add(directionalLight.position,'z').min(0).max(10).step(0.001).name('LightZ')

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
    canvas: canvas,
    antialias: true
})

//Renderer 
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
//There are still Gramma Encoding which let us play with the gammaFactor
// that woulf act like contolling of  brightness
//Default is linear Encoding

//tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

gui.add(renderer,'toneMappingExposure').min(0).max(10).step(0.001)

gui.add(renderer, "toneMapping",{
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(()=>{
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})
// NoToneMapping, LinearToneMapping, ReinhardToneMapping, CineonToneMapping
renderer.render(scene, camera)

/**
 * shadows
 */
directionalLight.castShadow = true

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

/**
 * Note
 * 
 * Antiatlaising
 * super sampling >> separating the pixel in 2 expotential wat of pixel to rederer
 * 
 * multi-sampling >> applying super-sampling to edge , we have to make this in first intailizing
 * 
 */


