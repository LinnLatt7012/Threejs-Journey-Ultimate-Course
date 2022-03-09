import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
// one way of using typeface
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json' 

// Scene
const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
const donut = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3,0.2,20,45),
    material
)
donut.position.x= 1.5

const cube = new THREE.Mesh( 
    new THREE.BoxGeometry(1, 1, 1,5,5,5),
    material
    )
    cube.position.x = -1.5
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10,10,32,32),
    material
)
plane.rotation.x = - Math.PI/2
plane.position.y = -0.9

scene.add(cube, sphere,plane, donut)

//texture
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png') // nidorx/matcap git repo

//light 
const  ambientLight =  new THREE.AmbientLight(0xffffff,0.5 )
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0x00effc,0.3)
directionalLight.position.set(1,0.25,0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000,0x0000ff,1)
scene.add(hemisphereLight)

const  pointLight =  new THREE.PointLight(0xff9900,2,2,10)
pointLight.position.set(-1,-0.4,1)
scene.add(pointLight)

const recLight = new THREE.RectAreaLight(0x0000ff,2,2,1)
recLight.position.set(0,-0.5,1)
recLight.rotation.x = Math.PI/2
scene.add(recLight)

const spotLight = new THREE.SpotLight(0x78ff00,0.5,10,Math.PI*0.1,0,1)
spotLight.position.set(0,2,1)

scene.add(spotLight)

// // to move spotLight 

scene.add(spotLight.target)
spotLight.target.position.x= -1

// light helper
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,0.2)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2)
// scene.add(pointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)
// window.requestAnimationFrame(()=>spotLightHelper.update())

// const recLightHelper  = new RectAreaLightHelper(recLight)
// scene.add(recLightHelper)

// window.requestAnimationFrame(()=>{
//     recLightHelper.position.copy(recLight.position)
//     recLightHelper.rotation.copy(recLight.rotation)
//     // recLightHelper.position.x = recLight.position.x
//     // recLightHelper.position.y = recLight.position.y
//     // recLightHelper.position.z = recLight.position.z
//     recLightHelper.update()
// })
//another way of using typeface
const fontLoader = new THREE.FontLoader()

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

camera.position.z = 3
camera.position.x = 1

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

renderer.render(scene, camera)

const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y = 0.1* elapsedTime
    cube.rotation.y = 0.1* elapsedTime
    donut.rotation.y = 0.1* elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x  = 0.15 * elapsedTime
    donut.rotation.x  = 0.15 * elapsedTime

	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()