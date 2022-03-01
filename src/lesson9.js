import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//event handling
window.addEventListener('resize', (event)=>{
    // console.log(`y`, event.clientY );
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    //render
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})   

// Scene
const scene = new THREE.Scene()

const vertex= (x,y,z)=>{
    return new THREE.Vector3(x,y,z)
}
const face= (x,y,z)=>{
    return new THREE.Face3(x,y,z)
}


// Objects
// const Geometry = new THREE.BoxGeometry(1, 1, 1,2,2,2)
// const Geometry = new THREE.BoxBufferGeometry(1, 1, 1,2,2,2)

// const positionsArray = new Float32Array([
//     0,0,0,
//     0,1,0,
//     1,0,0,
//     1,2,0,
//     1,0,0,
//     0,1,0,
//     1,2,0,
//     0,1,0,
//     1,4,-2,
// ])
const positionsArray = new Float32Array(500*9)
positionsArray.forEach((__,ind) => {
    positionsArray[ind]=((Math.random()-0.5)*4)
});

const positionAttribute = new THREE.BufferAttribute(positionsArray,3)

const Geometry = new THREE.BufferGeometry()
Geometry.setAttribute('position',positionAttribute)


// const Geometry = new THREE.Geometry()

// Geometry.vertices.push(vertex(0,0,0))
// Geometry.vertices.push(vertex(0,1,0))
// Geometry.vertices.push(vertex(1,0,0))

// Geometry.faces.push(face(0,1,2))

// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 3; j++) {
//         Geometry.vertices.push(vertex(
//             (Math.random()-0.5)*4,
//             (Math.random()-0.5)*4,
//             (Math.random()-0.5)*4)
//         )
//     }
//     const vertexIndex =i*3
//     Geometry.faces.push(face(vertexIndex,vertexIndex+1,vertexIndex+2))
// }

const Material = new THREE.MeshBasicMaterial({
    color: '#ff0000',
    wireframe: true
})


const mesh = new THREE.Mesh(Geometry, Material)
scene.add(mesh)
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
//controls
const controls = new OrbitControls(camera,canvas)
// controls.enabled = false
controls.enableDamping =true
controls.update()


scene.add(camera)
// camera.lookAt(mesh.position)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.render(scene, camera)

const tick =() =>{

	renderer.render(scene, camera)
    requestAnimationFrame(tick); //calling next frame, telling what to do in that frame
}
tick()