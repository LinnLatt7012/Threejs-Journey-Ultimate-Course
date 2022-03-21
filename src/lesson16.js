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
//Texture
const textureLoader = new THREE.TextureLoader()

const doorColorTexture =  textureLoader.load( '/textures/door/color.jpg')
const doorAlphaTexture =  textureLoader.load( '/textures/door/alpha.jpg')
const doorHeightTexture =  textureLoader.load( '/textures/door/height.jpg')
const doorNormalTexture =  textureLoader.load( '/textures/door/normal.jpg')
const doorAmbientOcclusionTexture =  textureLoader.load( '/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture =  textureLoader.load( '/textures/door/metalness.jpg')
const doorRoughnessTexture =  textureLoader.load( '/textures/door/roughness.jpg')

const brickColorTexture =  textureLoader.load( '/textures/bricks/color.jpg')
const brickNormalTexture =  textureLoader.load( '/textures/bricks/normal.jpg')
const brickAmbientOcclusionTexture =  textureLoader.load( '/textures/bricks/ambientOcclusion.jpg')
const brickRoughnessTexture =  textureLoader.load( '/textures/bricks/roughness.jpg')

const grassColorTexture =  textureLoader.load( '/textures/grass/color.jpg')
const grassNormalTexture =  textureLoader.load( '/textures/grass/normal.jpg')
const grassAmbientOcclusionTexture =  textureLoader.load( '/textures/grass/ambientOcclusion.jpg')
const grassRoughnessTexture =  textureLoader.load( '/textures/grass/roughness.jpg')
grassColorTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 200
})
//Canvas
const canvas = document.querySelector('canvas.webgl')

//Fog
const fog = new THREE.Fog('#262837',1.5,15)
scene.fog = fog
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/** 
 * Lights
 */

//Ambient Light 
const  ambientLight =  new THREE.AmbientLight('#b9b5ff',0.12 )
scene.add(ambientLight)

gui.add(ambientLight,'intensity').min(0).max(1).step(0.001)
//directionalLight
const moonLight = new THREE.DirectionalLight('#b9b5ff',0.12)
moonLight.position.set(4,5,-2)
scene.add(moonLight)
gui.add(moonLight,'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position,'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position,'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position,'z').min(-5).max(5).step(0.001)

//Door Light 
const doorLight = new THREE.PointLight('#ff7d46',1,7)
doorLight.position.set(0,2.2,2.7)
scene.add(doorLight)

/**
 * GHosts
 */
const ghost1 = new THREE.PointLight('#ff00ff',2,3)
const ghost2 = new THREE.PointLight('#00ffff',2,3)
const ghost3 = new THREE.PointLight('#ffff00',2,3)

scene.add(ghost1,ghost2,ghost3)

//Object
//House
const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture,
        aoMap: brickAmbientOcclusionTexture,
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

walls.position.y = 1.25 
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)

roof.position.y = 2.5 + 0.5
roof.rotation.y =  Math.PI*0.25
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent:true,
        alphaMap:doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale:0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)
//Floor 
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20,20,32,32),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        aoMap: grassAmbientOcclusionTexture,
        
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//bush
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.25,0.25,0.25)
bush1.position.set(-0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(0.8,0.1,2.2)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.4)
scene.add(bush1,bush2,bush3,bush4)
//Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color:'#b2b6b1'})

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3.2 + Math.random() * 6
    const x = Math.sin(angle) *radius
    const z = Math.cos(angle) *radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random()-0.5) * 0.4
    grave.rotation.z = (Math.random()-0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}
// Camera
// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.y = 10
camera.position.z= 15
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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

/**
 * shadows
 */
moonLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
doorLight.castShadow = true

house.castShadow = true
// door.castShadow = true
walls.castShadow = true
roof.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
graves.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width=256
doorLight.shadow.mapSize.height=256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width=256
ghost1.shadow.mapSize.height=256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width=256
ghost2.shadow.mapSize.height=256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width=256
ghost3.shadow.mapSize.height=256
ghost3.shadow.camera.far = 7

//Animation
gsap.to(camera.position, { duration: 2.5, y: 4 })
gsap.to(camera.position, { duration: 1.5, z: 7 })
// gsap.to(camera.position,{duration:2,delay: 2.5, x : Math.sin(10)} )
gsap.fromTo(camera.position,{x : 0},{delay:3 ,duration:4, x : 10})
// camera.position.z = 10
// camera.position.y = 4
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * 0.32
    ghost1.position.x = Math.cos(ghost1Angle)*4
    ghost1.position.z = Math.sin(ghost1Angle)*4
    ghost1.position.y = Math.sin(elapsedTime*3)

    const ghost2Angle = - elapsedTime * 0.4
    ghost2.position.x = Math.cos(ghost2Angle)* 5
    ghost2.position.z = Math.sin(ghost2Angle)* 5
    ghost2.position.y = Math.sin(elapsedTime* 4) + Math.sin(elapsedTime *2.5)

    const ghost3Angle = elapsedTime * 0.12
    ghost3.position.x = Math.cos(ghost3Angle)* (7 + Math.sin(elapsedTime *0.32))
    ghost3.position.z = Math.sin(ghost3Angle)* (7 + Math.sin(elapsedTime *0.32))
    ghost3.position.y = Math.sin(elapsedTime* 2)


    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()