import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import CANNON from 'cannon'
import { SpriteMaterial } from 'three'

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
    parameters.add()
})
//Audio 
const hitSong = new Audio('/sounds/hit.mp3')
const playHitSong = () => {
    hitSong.currentTime = 0
    hitSong.play()
}
// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 200
})
//
const parameters = {
    add: ()=> {
        const type = Math.random() < 0.5? 'Sphere':'Box'
        const position = {
            x: (Math.random()-0.5)*4,
            y: (Math.random())*6,
            z: (Math.random()-0.5)*4,
        }
        const size = type!=='Box'?{radius:Math.random()*0.5}:{
            width:Math.random()*1.5,
            height:Math.random()*1.5,
            depth:Math.random()*1.5}
        createMesh(size,position,type)}
}
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
const  ambientLight =  new THREE.AmbientLight('#ffffff',0.5 )
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
directionalLight.position.set(2,2,-1)
scene.add(directionalLight)

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
 * Physics
 */
//World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true // SpeedLimit & SpeedTimeLimit are also allowed
world.gravity.set(0,-9.82,0)
//material
const concretMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concretMaterial,
    plasticMaterial,{
        friction:0.1,
        restitution:0.7
    }
)
const twoPlasticContactMaterial =  new CANNON.ContactMaterial(
    plasticMaterial,
    plasticMaterial,{
        friction:0.1,
        restitution:0.8,
    }
)
world.addContactMaterial(concretePlasticContactMaterial)
// world.addContactMaterial(twoPlasticContactMaterial)
// const defaultMaterial = new CANNON.Material('default')
// const defaultContactMaterial = new CANNON.ContactMaterial(
//     defaultMaterial,
//     defaultMaterial,{
//         friction:0.1,
//         restitution:0.7
//     }
// )
// // world.defaultContactMaterial = concretMaterial// it even reduce any other thing like adding material to body
//sphere
// const sphereShape =  new CANNON.Sphere(0.3)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0,3,0),
//     shape: sphereShape,
//     material:plasticMaterial
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(150,0,0), new CANNON.Vec3(0,0,0))
// world.addBody(sphereBody)
//floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass:0,
    material:concretMaterial    
})
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI * 0.5
    )
world.addBody(floorBody)
//Objects
// const sphere = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(0.3,64,64),
//     new THREE.MeshStandardMaterial({
//         envMap:environmentMap,
//         color:'#ffffff',
//         roughness: 0.5,
//         metalness:0.5,
//     })
// )
// sphere.position.copy(sphereBody.position)
// scene.add(sphere)
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10,10,32,32),
    new THREE.MeshStandardMaterial({
        envMap:environmentMap,
        color:'#262837',
        roughness: 0.6,
        metalness:0.8,
 })
)
floor.rotation.x = - Math.PI * 0.4999
scene.add(floor)

// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 6
camera.position.y = 1

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

/**
 * shadows
 */
directionalLight.castShadow = true

floor.receiveShadow = true
// sphere.castShadow = true
/**
 * Utils
 */
const objectToUpdate = [];

const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMap
})
const boxGeometry = new THREE.BoxBufferGeometry(1,1,1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMap
})
const createMesh =  (size,position,type='Sphere' ) =>{
    // THREE.js mesh
    let mesh = null;
    let body = null;
    if(type == 'Sphere'){
        const {radius} = size
        mesh = new THREE.Mesh(sphereGeometry,sphereMaterial)
        mesh.scale.set(radius,radius,radius)
        mesh.castShadow = true
        mesh.position.copy(position)
        scene.add(mesh)
        // Cannon.js body
        const shape = new CANNON.Sphere(radius)
        body = new CANNON.Body({
            mass:Math.random()*2,
            shape,
            material:  plasticMaterial
        })
    }else{
        const {width,height,depth} = size
        mesh = new THREE.Mesh(boxGeometry,boxMaterial)
        mesh.scale.set(width,height,depth)
        mesh.castShadow = true
        mesh.position.copy(position)
        scene.add(mesh)
        // Cannon.js body
        const shape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,depth/2))
        body = new CANNON.Body({
            mass:Math.random()*2,
            shape,
            material:  plasticMaterial
        })
    }
    body.position.copy(position)
    body.addEventListener('collide',playHitSong)
    world.addBody(body)
    //save in objects to update
    objectToUpdate.push({
        mesh,
        body
    })
}
createMesh({radius:0.5}, {x:0,y:3,z:0})
createMesh({radius:0.5}, {x:0.02,y:5,z:0})
createMesh({radius:0.5}, {x:2,y:5,z:0})
createMesh({width:0.5,height:0.5,depth:0.5}, {x:2,y:5,z:0},'Box')
gui.add(parameters,'add')
/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //Force
    // sphereBody.applyForce(new CANNON.Vec3(-0.05,0,0),sphereBody.position)
    //Update psychsics world
    world.step(1/60,deltaTime,3)
    // sphere.position.copy(sphereBody.position)
    for(const object of objectToUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()


//Note
/**
 * Learn about Worker when you have frame rate issue
 * Cannon es is the one which is forked and updated by community
 * 0.15.1
 * Ammon Js for more advance stuff and futher learning
 * 
 * Psychsijs
 */