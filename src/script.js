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
    }
)


// Scene
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI({
    // closed: true,
    width: 400
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
const ambientLight = new THREE.AmbientLight(0xffffff,0.80)
scene.add(ambientLight)

const direcLight = new THREE.DirectionalLight('#FAAF30',1)
direcLight.position.set(0,10,10)
// direcLight.rotation.set(1,1,1)
scene.add(direcLight)
// const directionalLightHelper = new THREE.DirectionalLightHelper(direcLight,0.2)
// scene.add(directionalLightHelper)

// const spotLight = new THREE.SpotLight(0xffffff,0.3,10,Math.PI*0.25,0,1)
// spotLight.position.set(0,2,0)
// scene.add(spotLight)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)
// window.requestAnimationFrame(()=>spotLightHelper.update())
/**
 * texture Loader
 */
// const loaderManager= new THREE.tex(
//     (t)=>{
//        t.wrapS= 1000;
//        t.wrapT= 1000;
//        t.repeat.set(1,1)
//        t.offset.setX(0.5)
//     }
// )
 const textureLoader = new THREE.TextureLoader()
 const frontTexture = textureLoader.load('/textures/ribbon/front.png',(t)=>{
    t.wrapS= 1000;
    t.wrapT= 1000;
    t.repeat.set(1,-1)
    t.offset.setX(0.5)
 })
 const backTexture = textureLoader.load('/textures/ribbon/back.png',(t)=>{
    t.wrapS= 1000;
    t.wrapT= 1000;
    t.repeat.set(-1,-1)
    t.offset.setX(0.5)
 })
// [frontTexture,backTexture].forEach(t=>{
//      t.wrapS= 1000;
//      t.wrapT= 1000;
//      t.repeat.set(1,1)
//      t.offset.setX(0.5)
//  })
/**
 * Objects
 */

let frontMaterial= new THREE.MeshStandardMaterial({
    map:frontTexture,
    side:THREE.BackSide,
    roughness:0.65,
    metalness:0.25,
    alphaTest:0.8,
    flatShading:true
})
let backMaterial= new THREE.MeshStandardMaterial({
    map:backTexture,
    side:THREE.FrontSide,
    roughness:0.65,
    metalness:0.25,
    alphaTest:0.8,
    flatShading:true
})


const gemoetry = new THREE.SphereBufferGeometry(1,30,30);
const sphere = new THREE.Mesh(
    gemoetry, 
    new THREE.MeshBasicMaterial(
        {
            color: 0x00ff00,
            wireframe: true
        }
    ))
// scene.add(sphere)

let num = 7;
let curvePoints =[]
const getPointsArray=()=>{
    let t= 7;
    const minAngle = 0.3 *Math.PI,
    maxAngle =  .7 * Math.PI,
    deviation = .25 * Math.PI,
    r = [Math.random()* (maxAngle - minAngle) + minAngle]

    for(let u =1;u<t-1;u++){
        const t = Math.min(maxAngle, r[u-1]+deviation),
        s = Math.max(minAngle,r[u-1]-deviation);
        r.push(Math.random()*(t-s)+s)
    }
    const s = Math.min(maxAngle, r[t-2]+deviation,r[0]+deviation),
    a = Math.max(minAngle,r[t-2]-deviation, r[0]-deviation)
    r.push(Math.random()*(s-a)+a);
    const o = r.slice().sort 
    ,l=o[0],
    c = o[o.length -1]

    return r;
}
let angle = getPointsArray();
for (let i = 0; i < num; i++) {
    let theta = i/num * Math.PI*2;
    curvePoints.push(
        new THREE.Vector3().setFromSphericalCoords(
            1,angle[i], theta
        )
    )  
}
const curve = new THREE.CatmullRomCurve3( curvePoints );
curve.tension= 0.7;
curve.closed = true;
const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
// scene.add(curveObject);

let number = 1000

let frenetFrames= curve.computeFrenetFrames(number,true)
let spacePoints = curve.getSpacedPoints(number)
let tempPlane= new THREE.PlaneBufferGeometry(1,1,number,1)

let materials = [frontMaterial,backMaterial]
tempPlane.addGroup(0,6000,0)
tempPlane.addGroup(0,6000,1)
let dimension= [-.15,0.15]

let point = new THREE.Vector3();
let binormalShift= new THREE.Vector3();
let tem2 = new THREE.Vector3()

let finalPoints = []


dimension.forEach(d=>{
    for(let i=0;i<=number;i++){
        point = spacePoints[i];
        binormalShift.copy(frenetFrames.binormals[i]).multiplyScalar(d);

        finalPoints.push(new THREE.Vector3().copy(point).add(binormalShift).normalize())
    }
})

finalPoints[0].copy(finalPoints[number])
finalPoints[number+1].copy(finalPoints[2*number+1])
// finalPoints[2*number+1].copy(finalPoints[number+1]])
console.log(finalPoints[2*number+2],finalPoints[number+1]);
tempPlane.setFromPoints(finalPoints)

let finalPlane= new THREE.Mesh(tempPlane,
    materials
    )

scene.add(finalPlane) 
finalPlane.castShadow=true;
finalPlane.receiveShadow=true;
/**
 * Camera
 */
const aspect = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height,0.01, 1000 )
camera.position.z = 2
// camera.position.y = 4

scene.add(camera)

//Controls

const controls = new OrbitControls(camera,canvas)
// controls.enabled = false
controls.enableDamping =true
controls.update()
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})


//Renderer 
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.render(scene, camera)
renderer.setClearColor(0xeeeeee,1)
// renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
/**
 * shadows
 */

/**
 * Animation
 */
const clock = new THREE.Clock()
const tick =() =>{
    const elapsedTime = clock.getElapsedTime()

    materials.forEach((m,i)=>{
        m.map.offset.setX(elapsedTime*0.05)
        if(i>0){
            m.map.offset.setX(-elapsedTime*0.05)  
        }
    })
    controls.update()
	renderer.render(scene, camera)
    requestAnimationFrame(tick); 
}


console.log(getPointsArray())
tick()