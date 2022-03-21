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

const particleColorTexture = textureLoader.load('/textures/particles/2.png')

// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 200
})

//Canvas
const canvas = document.querySelector('canvas.webgl')


/** 
 * Lights
 */

//Ambient Light 
// const  ambientLight =  new THREE.AmbientLight('#b9b5ff',0.5 )
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff,0.6)
// directionalLight.position.set(2,2,-1)
// scene.add(directionalLight)
/**
 * Particles
 */
//Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000
const positions = new Float32Array(count*3)
const colors = new Float32Array(positions.length)
positions.forEach((__,ind) => {
    positions[ind]= (Math.random()-0.5) * 10
    colors[ind]= Math.random()
});

particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
particlesGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
//Material
const particlesMaterial = new THREE.PointsMaterial({
    // color: '#00effc',
    transparent: true,
    alphaMap: particleColorTexture,
    size: 0.1,
    sizeAttenuation: true,
    // alphaTest: 0.001 ,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

//Points
const particles =  new THREE.Points(
    particlesGeometry,
    particlesMaterial
)
scene.add(particles)
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Camera
 */ 


// near and far is to define how much camera can seee and render
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1, 100 )
camera.position.z = 3
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
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

/**
 * shadows
 */

/**
 * Animation
 */
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < positions.length/3; i++ ) {
        const i3 = i*3;
        const x =particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin((elapsedTime+x)*2)/2
        // particlesGeometry.attributes.position.array[i3 ] = Math.sin(elapsedTime)   
    }
    particlesGeometry.attributes.position.needsUpdate = true
    particles.position.x = Math.sin(elapsedTime/2)
    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()