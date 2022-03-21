import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

const mouse =new THREE.Vector2()
let currentIntersects =  null
window.addEventListener('mousemove',(event)=>{
    mouse.x =  event.clientX / sizes.width *2 -1
    mouse.y =  -(event.clientY / sizes.height *2 -1)
    // console.log(mouse);
})
window.addEventListener('click',(event)=>{
    // mouse.x =  event.clientX / sizes.width *2 -1
    // mouse.y =  -(event.clientY / sizes.height *2 -1)
    console.log('click');
    if(currentIntersects){
        switch(currentIntersects.object){
            case sphere1:
                currentIntersects.object.material.color.set(currentIntersects.object.material.color.r==1?'blue':'red')
                break
            case sphere2:
                currentIntersects.object.material.color.set(currentIntersects.object.material.color.r==1?'blue':'red')
                break
            case sphere3:
                currentIntersects.object.material.color.set(currentIntersects.object.material.color.r==1?'blue':'red')
                break
        }
    }
})
//Texture
const textureLoader = new THREE.TextureLoader()

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

/** 
 * Lights
 */

//Ambient Light 
// const  ambientLight =  new THREE.AmbientLight('#b9b5ff',0.12 )
// scene.add(ambientLight)
// const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
// directionalLight.position.set(2,2,-1)
// scene.add(directionalLight)
//Object
//House

const material = new THREE.MeshBasicMaterial({color:'red'})

const sphere1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    new THREE.MeshBasicMaterial({color:'red'})
)
const sphere2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    new THREE.MeshBasicMaterial({color:'red'})
)
const sphere3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    new THREE.MeshBasicMaterial({color:'red'})
)
sphere1.position.x= -2.5
sphere3.position.x= 2.5

scene.add(sphere1,sphere2,sphere3)

/**
 * Raycaster
 */
 const vector= (x,y,z)=>{
    return new THREE.Vector3(x,y,z)
}
const raycaster = new THREE.Raycaster()
// const rayOrigin = vector(-4,0,0)
// const rayDirection = vector(10,0,0)
// rayDirection.normalize()
// raycaster.set(rayOrigin,rayDirection)

// const intersect = raycaster.intersectObject(sphere2)
// console.log(`intersect`, intersect);

// const intersects = raycaster.intersectObjects([sphere1,sphere2,sphere3])
// console.log(`intersects`, intersects);

// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 4
// camera.position.y = 4

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
// renderer.setClearColor('#262837')
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

/**
 * shadows
 */



const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    sphere1.position.y = Math.sin(elapsedTime*0.4) *1.5
    sphere2.position.y = Math.sin(elapsedTime*0.8) *1.5
    sphere3.position.y = Math.sin(elapsedTime*1.5) *1.5
    //cast a ray
    // const rayOrigin = vector(-4,0,0)
    // const rayDirection = vector(1,0,0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin,rayDirection)

    //mouse a ray
    raycaster.setFromCamera(mouse,camera)

    const objectToTest = [sphere1,sphere2,sphere3]
    const intersects = raycaster.intersectObjects(objectToTest)
    if(intersects.length){
        if(currentIntersects===null){
            // intersects[0].object.material.color.set(intersects[0].object.material.color.r==1?'blue':'red')
            // console.log('enter');
        }
        currentIntersects= intersects[0]
    }else{
        if(currentIntersects)
            // console.log('leave');
        currentIntersects = null
    }
    // for(const intersect of intersects){
    //     intersect.object.material.color.set(intersect.object.material.color.r==1?'blue':'red')
    // }

    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()