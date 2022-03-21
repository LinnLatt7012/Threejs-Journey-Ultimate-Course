import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ToneMapping } from 'three'
import waterVertexShader from './shaders/water1/vertex.glsl'
import waterFragmentShader from './shaders/water1/fragment.glsl'
// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 200
})
const BigWv=gui.addFolder('BigWave')
const SmallWv=gui.addFolder('SmallWave')
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
// const directionalLight = new THREE.DirectionalLight(0xffffff,3)
// directionalLight.position.set(2,2,0)
// scene.add(directionalLight)


// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 2
camera.position.y = 1
camera.position.x = -0.4

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
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFShadowMap

//Object
const gemoetry = new THREE.PlaneBufferGeometry(2,2,128,128)
//Color
debugObject.depthColor='#070f46'
debugObject.surfaceColor='#88c9ff'

//Material
const material = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    transparent:true,
    side: THREE.DoubleSide,
    uniforms:{
        uTime:{value: 0},
        
        uBigWavesElevation:{value:0.15},
        uBigWavesFrequency:{value: new THREE.Vector2(4,1.5)},
        uBigWavesSpeed:{value: 0.75},

        uSmallWavesElevation:{value:0.25},
        uSmallWavesFrequency:{value: new THREE.Vector2(2,3.5)},
        uSmallWavesSpeed:{value: 0.75},
        uSmallIterations:{value: 4},

        uDepthColor:{value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor:{value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset:{value:0.2},
        uColorMultiplier:{value:2.8}
        
    }
})

BigWv.add(material.uniforms.uBigWavesElevation,'value').min(0.0).max(1).step(0.001).name('BigWvElev');
BigWv.add(material.uniforms.uBigWavesFrequency.value,'x').min(0.0).max(15).step(0.001).name('BigWvFreqX');
BigWv.add(material.uniforms.uBigWavesFrequency.value,'y').min(0.0).max(15).step(0.001).name('BigWvFreqY');
BigWv.add(material.uniforms.uBigWavesSpeed,'value').min(0.0).max(4).step(0.001).name('uBigWvSpd');

SmallWv.add(material.uniforms.uSmallWavesElevation,'value').min(0.0).max(1).step(0.001).name('SmallWvElev');
SmallWv.add(material.uniforms.uSmallWavesFrequency.value,'x').min(0.0).max(15).step(0.001).name('SmallWvFreqX');
SmallWv.add(material.uniforms.uSmallWavesFrequency.value,'y').min(0.0).max(15).step(0.001).name('SmallWvFreqY');
SmallWv.add(material.uniforms.uSmallWavesSpeed,'value').min(0.0).max(4).step(0.001).name('uSmallWvSpd');
SmallWv.add(material.uniforms.uSmallIterations,'value').min(0.0).max(4).step(1).name('uSmallIterations');

gui.addColor(debugObject,'depthColor').onChange(()=>{
    material.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject,'surfaceColor').onChange(()=>{
    material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
gui.add(material.uniforms.uColorOffset,'value').min(0.0).max(4).step(0.001).name('uColorOffset');
gui.add(material.uniforms.uColorMultiplier,'value').min(0.0).max(4).step(0.001).name('uColorMultiplier');
const plane = new THREE.Mesh(
    gemoetry,
    material
)

plane.rotation.x = - Math.PI * 0.5
scene.add(plane)
renderer.render(scene, camera)

/**
 * shadows
 */
// directionalLight.castShadow = true

//Animate
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    //material 
    material.uniforms.uTime.value = elapsedTime

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


