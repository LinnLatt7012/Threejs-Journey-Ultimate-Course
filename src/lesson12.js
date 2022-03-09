import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color } from 'three'
import * as dat from 'dat.gui'

// Canvas
const cursor ={
    x:0,
    y:0
}
const canvas = document.querySelector('canvas.webgl')
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

//texture
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

const textureLoader = new THREE.TextureLoader()

const doorColorTexture =  textureLoader.load( '/textures/door/color.jpg')
const doorAlphaTexture =  textureLoader.load( '/textures/door/alpha.jpg')
const doorHeightTexture =  textureLoader.load( '/textures/door/height.jpg')
const doorNormalTexture =  textureLoader.load( '/textures/door/normal.jpg')
const doorAmbientOcclusionTexture =  textureLoader.load( '/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture =  textureLoader.load( '/textures/door/metalness.jpg')
const doorRoughnessTexture =  textureLoader.load( '/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/2.png') // nidorx/matcap git repo
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

//material
// const material =  new THREE.MeshBasicMaterial({
//     map : doorColorTexture,
//     // color: 'green'
// }) //basic color

// material.transparent = true;
// material.alphaMap =  doorAlphaTexture;
// material.opacity = 0.5
// material.side = THREE.DoubleSide

// const material =  new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material =  new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material =  new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000
// material.specular.set(0x1188ff)

// const  material =  new THREE.MeshToonMaterial()
// gradientTexture.minFilter =  THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

const material =  new THREE.MeshStandardMaterial()
material.metalness = 0.45
material.roughness = 0.65
material.alphaMap =doorAlphaTexture
material.normalMap = doorNormalTexture
material.map = doorColorTexture
material.displacementMap = doorHeightTexture
material.roughnessMap = doorRoughnessTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 2
material.transparent = true
material.envMap = environmentMap
material.displacementScale =0.1
//debug
const gui = new dat.GUI({
    // closed: true,
    width: 400
})

gui.add(material,'metalness').max(1).min(0).step(0.0001).name('metalness')
gui.add(material,'roughness').max(1).min(0).step(0.0001).name('roughness')
gui.add(material,'aoMapIntensity').max(10).min(0).step(0.1).name('aoMapIntensity')
gui.add(material,'displacementScale').max(1).min(0).step(0.001).name('displacementScale')


//Objects

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    material
)

sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2)
)

sphere.position.x= -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,32,32),
    material
)

plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2)
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5,0.2,64,128),
    material
)

torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2)
)

torus.position.x = 1.5

scene.add(sphere,plane,torus)

//light 
const  ambientLight =  new THREE.AmbientLight(0xffffff,0.5)
const  pointLight =  new THREE.PointLight(0xffffff,0.5)

pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(ambientLight, pointLight)

// Camera
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspect,0.1, 100 )

camera.position.z = 5
scene.add(camera)

//Controls
const controls = new OrbitControls(camera,canvas)
controls.enableDamping =true
controls.update()
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.render(scene, camera)
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y = 0.1* elapsedTime
    plane.rotation.y = 0.1* elapsedTime
    torus.rotation.y = 0.1* elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x  = 0.15 * elapsedTime
    torus.rotation.x  = 0.15 * elapsedTime

	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()