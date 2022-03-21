import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Scene
const scene = new THREE.Scene()
const gui = new dat.GUI({
    // closed: true,
    width: 200
})

//texture
const textureLoader = new THREE.TextureLoader()
const simplebakedTexture = textureLoader.load('textures/simpleShadow.jpg')

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.5
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.3,64,32),
    material
)
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5,5,32,32),
    material
)
const shadowPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,32,32),
    new THREE.MeshBasicMaterial(
        {
            color: 0x000000,
            alphaMap:simplebakedTexture,
            transparent:true,
            opacity:1
        }
    )
)
plane.rotation.x = - Math.PI/2
plane.position.y = -0.49
shadowPlane.rotation.x = - Math.PI/2
shadowPlane.position.y = -0.45

sphere.castShadow = true
plane.receiveShadow = true
scene.add(sphere,plane,shadowPlane)

//light 
const  ambientLight =  new THREE.AmbientLight(0xffffff,0.3 )
scene.add(ambientLight)
//directionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
// directionalLight.position.set(2,2,-1)
scene.add(directionalLight)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512
directionalLight.shadow.mapSize.height = 512
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far= 6
directionalLight.shadow.camera.left= 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right= - directionalLight.shadow.camera.left
directionalLight.shadow.camera.buttom = - directionalLight.shadow.camera.top
// directionalLight.shadow.radius = 5

//pointLight
// const  pointLight =  new THREE.PointLight(0xff9900,0.3)
// pointLight.position.set(-1,1,0)
// scene.add(pointLight)
// pointLight.castShadow= true
// spotLight
const spotLight = new THREE.SpotLight(0xffffff,0.3,10,Math.PI*0.25,0,1)
spotLight.position.set(0,2,0)
// spotLight.castShadow = true
// spotLight.shadow.mapSize.width = 1024
// spotLight.shadow.mapSize.height = 1024
// spotLight.shadow.camera.near = 1
// spotLight.shadow.camera.far= 6
// spotLight.shadow.camera.fov= 30
scene.add(spotLight)
scene.add(spotLight.target)

//helper 
// const directionalLightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCamHelper)
// gui.add(directionalLightCamHelper,'visible').setValue(false)

// const pointLightCamHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(pointLightCamHelper)
// gui.add(pointLightCamHelper,'visible').setValue(true).name('pointLight')

// const spotLightCamHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(spotLightCamHelper)
// gui.add(spotLightCamHelper,'visible').setValue(true).name('spotLight')
// gui.add(spotLight.shadow.camera,'fov').min(0).max(60).name('spotLightFov')

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

// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )

camera.position.z = 2
camera.position.x = 1
camera.position.y = 1

camera.lookAt(sphere.position)
scene.add(camera)

//Controls

const controls = new OrbitControls(camera,canvas)
// controls.enabled = false
controls.enableDamping =true
controls.update()
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
// renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

//DEBUG

//debug


gui.add(ambientLight,'intensity').min(0).max(1).step(0.01)
gui.add(directionalLight,'intensity').min(0).max(1).step(0.01)
gui.add(material,'metalness').min(0).max(1).step(0.001).name('metalness')
gui.add(material,'roughness').min(0).max(1).step(0.001).name('roughness')
gui.add(directionalLight.position,'x').min(-4).max(4).step(0.01)
gui.add(directionalLight.position,'y').min(-4).max(4).step(0.01)
gui.add(directionalLight.position,'z').min(-4).max(4).step(0.01)

const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    sphere.position.x = Math.cos(elapsedTime)*1.5
    sphere.position.z = Math.sin(elapsedTime)*1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime*3))
    
    shadowPlane.position.x =sphere.position.x 
    shadowPlane.position.z =sphere.position.z
    shadowPlane.material.opacity= (1-sphere.position.y)*0.4

	renderer.render(scene, camera)
    // spotLight.position.copy(camera.position)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()