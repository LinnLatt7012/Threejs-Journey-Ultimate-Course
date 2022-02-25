// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000',
})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)

const sphereGeometry = new THREE.SphereGeometry( 1, 32,16 );
const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphereMesh = new THREE.Mesh(  sphereGeometry,sphereMaterial );
sphereMesh.position.x= 2
scene.add( sphereMesh );
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = 1
scene.add(camera)


//light
// const directionalLight = new THREE.DirectionalLight( 0x00ffff, 0.5 );
// directionalLight.position.z =4
// directionalLight.position.y =3
// scene.add( directionalLight );
// directionalLight.target = cubeGeometry
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
function animate(){
	requestAnimationFrame(animate);
	cubeMesh.rotation.x += 0.01;
	cubeMesh.rotation.y += 0.01;

	renderer.render(scene, camera)
}


renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

animate();