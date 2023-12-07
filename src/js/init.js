import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { FirstPersonControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/FirstPersonControls.js'
import * as CANNON from 'https://cdn.skypack.dev/cannon-es'

function init() {


    //Configurations
        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        })

        const timestep = 1 / 60

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.appendChild( renderer.domElement )

        scene.background = new THREE.Color('#87CEEB')

        camera.position.y = 1

        camera.position.x = -3
        camera.rotation.y = 11


    //First person camera
        let FirstPerson = new FirstPersonControls(camera, renderer.domElement)
        FirstPerson.movementSpeed = 0.5
        FirstPerson.lookSpeed = 0.07
        FirstPerson.lookVertical = false
        

    //Map

        //Ground
        const groundMass = new THREE.BoxGeometry(20, 1, 20)
        const groundTexture = new THREE.TextureLoader().load('texture/grass.png')
        const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture })
        const ground = new THREE.Mesh(groundMass, groundMaterial)

        const groundBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(10, 0, 10)),
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(0, -1, 0)
        })


        //Box
            const boxMass = new THREE.BoxGeometry(1, 1, 1)
            const boxTexture = new THREE.TextureLoader().load('texture/box.jpeg')
            const boxMaterial = new THREE.MeshBasicMaterial({ map: boxTexture })
            const box = new THREE.Mesh(boxMass, boxMaterial)

            const boxBody = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
                mass: 1,
                position: new CANNON.Vec3(1, 4, 0)
            })


        //Player
            const playerMass = new THREE.SphereGeometry(1, 20, 20)
            const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0FF00 })

            const player = new THREE.Mesh(playerMass, playerMaterial)

            const playerBody = new CANNON.Body({
                shape: new CANNON.Box(new CANNON.Vec3(1, 1.5, 1)),
                mass: 40,
                position: new CANNON.Vec3(0, 9, 0)
            })



        function map() {
            //load
            world.addBody(boxBody)
            world.addBody(playerBody)
            world.addBody(groundBody)
            scene.add(box, ground, player)
        }

        map()



    //Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const Light = new THREE.DirectionalLight(0xffffff, 1.3)
        Light.position.set(2, 5, 8)

        scene.add(Light)




    function animate() {
        requestAnimationFrame( animate )

        FirstPerson.update(0.08)

        world.step(timestep)

        box.position.copy(boxBody.position)
        box.quaternion.copy(boxBody.quaternion)

        ground.position.copy(groundBody.position)
        ground.quaternion.copy(groundBody.quaternion)

        player.position.copy(playerBody.position)
        player.quaternion.copy(playerBody.quaternion)
        playerBody.position.x = camera.position.x
        playerBody.position.z = camera.position.z
        camera.position.y = playerBody.position.y + 0.5


        renderer.render( scene, camera )
    }

    animate()


}

window.addEventListener('load', init())