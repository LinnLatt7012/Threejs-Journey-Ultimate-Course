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

/*****
 * Texture
 */
// 1st way
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload=()=>{
//    texture.needsUpdate = true
//     console.log('image loaded', texture)
// }
// image.src = '/textures/door/color.jpg'
// 2nd way

const loadingManager =  new THREE.LoadingManager()
loadingManager.onStart = () =>{
    console.log('onStart')
}
loadingManager.onLoad = () =>{
    console.log('onLoaded')
}
loadingManager.onProgress = () =>{
    console.log('on Progress')
}
loadingManager.onError= () =>{
     console.log('Error')
}
const textureLoader = new THREE.TextureLoader(loadingManager)
// const colorTexture =  textureLoader.load( 
//     '/textures/door/color.jpg',
//     ()=>{}, // on loaded
//     ()=>{}, // on progress
//     ()=>{} //error
//     )
    
const colorTexture =  textureLoader.load( '/textures/checkerboard-8x8.png')
const alpharTexture =  textureLoader.load( '/textures/door/alpha.jpg')
const heightTexture =  textureLoader.load( '/textures/door/height.jpg')
const normalTexture =  textureLoader.load( '/textures/door/normal.jpg')
const ambientOcclusionTexture =  textureLoader.load( '/textures/door/ambientOcclusion.jpg')
const metalnessTexture =  textureLoader.load( '/textures/door/metalness.jpg')
const roughnessTexture =  textureLoader.load( '/textures/door/roughness.jpg')

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3

// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI /5

// colorTexture.center.x = 0.5
// colorTexture.center.y =0.5

colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    map: colorTexture
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)
// Camera
// near and far is to define how much camera can seee and render
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
const aspect = sizes.width / sizes.height
camera.position.z = 3
scene.add(camera)
// camera.lookAt(cube.position)

//Controls

const controls = new OrbitControls(camera,canvas)
controls.enableDamping =true
// controls.enabled = false
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
