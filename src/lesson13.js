import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// one way of using typeface
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json' 

// Scene
const scene = new THREE.Scene()

const material = new THREE.MeshBasicMaterial()
const mesh = new THREE.Mesh( 
    new THREE.BoxGeometry(1, 1, 1,5,5,5),
    material
    )

// scene.add(mesh)

//texture
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/textures/matcaps/8.png') // nidorx/matcap git repo


//another way of using typeface
const fontLoader = new THREE.FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        const textGeometery = new THREE.TextBufferGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        // textGeometery.computeBoundingBox()
        // textGeometery.translate(
        //     - (textGeometery.boundingBox.max.x + textGeometery.boundingBox.min.x) * 0.5,
        //     - (textGeometery.boundingBox.max.y + textGeometery.boundingBox.min.y) * 0.5,
        //     - (textGeometery.boundingBox.max.z + textGeometery.boundingBox.min.z) * 0.5,
        // )
        textGeometery.center()
            textGeometery.computeBoundingBox()
            console.log(`text`, textGeometery.boundingBox);

        const material =  new THREE.MeshMatcapMaterial({ matcap: matcapTexture})
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometery,material)
        scene.add(text)
        
        const donutGeometery =  new THREE.TorusBufferGeometry(0.3,0.2,20,45)
        
        for (let i = 0; i < 300; i++) {
            const donut = new THREE.Mesh(donutGeometery,material);

            donut.position.x = (Math.random()-0.5) * 10
            donut.position.y = (Math.random()-0.5) * 10
            donut.position.z = (Math.random()-0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()

            donut.scale.set(scale,scale,scale)

            scene.add(donut)
            
        }
    }
)




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

const tick =() =>{
	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()