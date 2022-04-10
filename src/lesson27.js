import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import galaxyVertexShader from './shaders/galaxy/vertex1.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment1.glsl'

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
    }
)

//Texture
const textureLoader = new THREE.TextureLoader()

const particleColorTexture = textureLoader.load('/textures/particles/2.png')

// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 400
})

/**
 * Galaxy
 */
let geometry = null;
let points = null;
let material = null

const parameters= {
    count: 50000,
    size: 0.01,
    radius: 1,
    branch: 3,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor:'#ff5588',
    outsideColor:'#00effc',
    rotate: () => {
        gsap.to(points.rotation, 2.5,{  y: points.rotation.y + Math.PI *4 })
    }
}

const generateGalaxy = ()=>
{
    if(points !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count*3) 
    const color = new Float32Array(parameters.count*3) 
    const scale = new Float32Array(parameters.count) 
    const randomness = new Float32Array(parameters.count*3) 
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    for (let i = 0; i < parameters.count; i++ ) {
        const i3 = i*3;
        const radius =  Math.random()* parameters.radius
        const branchAngel = (i % parameters.branch)/parameters.branch * Math.PI * 2
        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5? -1 : 1) * parameters.randomness *radius
        const randomY =  Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5? -1 : 1) * parameters.randomness *radius
        const randomZ =  Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5? -1 : 1) * parameters.randomness *radius
        positions[i3 + 0]= Math.cos(branchAngel ) * radius 
        positions[i3 + 1]= 0
        positions[i3 + 2]= Math.sin(branchAngel ) * radius 
        randomness[i3 + 0]= randomX
        randomness[i3 + 1]= randomY *0.5
        randomness[i3 + 2]= randomZ
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius/parameters.radius)
        color[i3 + 0] =mixedColor.r;
        color[i3 + 1] =mixedColor.g;
        color[i3 + 2] =mixedColor.b;
        scale[i] = Math.random()
    };
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
    )
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(color,3)
    )
    geometry.setAttribute(
        'aScale',
        new THREE.BufferAttribute(scale,1)
    )
    geometry.setAttribute(
        'aRandomness',
        new THREE.BufferAttribute(randomness,3)
    )
    /**
     * Materials
     */
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: galaxyVertexShader, 
        fragmentShader: galaxyFragmentShader,
        uniforms:{
            uTime:{value:1.0},
            uSize:{value:30.0 * renderer.getPixelRatio()}

        }
    })
     /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters,'count').min(100).max(100000).step(10).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(1).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'branch').min(1).max(10).step(1).onFinishChange(generateGalaxy)
// gui.add(parameters,'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy)
gui.add(parameters,'rotate')
//Canvas
const canvas = document.querySelector('canvas.webgl')

/** 
 * Lights
 */

//Ambient Light 
// const  ambientLight =  new THREE.AmbientLight('#b9b5ff',0.5 )
// scene.add(ambientLight)

/**
 * Particles
 */


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
 * function  
 */
 generateGalaxy()
/**
 * shadows
 */

/**
 * Animation
 */
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime *0.2;
    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()