import './style.css'
import { cleanScene, sendCodeToBlender, sendObjectToBlender } from './blender_remote'
import { Light, Camera } from './lib'
import { CubeGrid, Cube, Plane } from 'root/geo'

// number of cubes on each axis
const count = 8

// size of grid
const extents = 2.0

// spacing between cubes
const padding = 0.025
// TODO: apply padding

cleanScene()

const grid = new CubeGrid([0, 0, 0], [extents, extents, extents], count, count, count)
grid.cubes().forEach((cube) => {
    console.log(cube)

    // let cube = new Cube([0, 1, 2], [3, 4, 5])
    // cube.attribs = { name: 'a cube', rotation: [1, 2, 3] }
    sendObjectToBlender(cube)

    // TODO: name the cube specifically and apply a material individually to each cube
    // let cube = new Cube([0, 1, 2], [3, 4, 5])
    // cube.attribs = { name: 'hello cube', rotation: [1, 2, 3] }
    // sendObjectToBlender(cube)
})

// add a sun lamp abote the grid
let light = new Light('SUN', 1.0, [0, 0, extents * 1.5])
sendObjectToBlender(light)

// Add an orthographic camera above the grid.
// Rotate 45 degrees on the x-axis, 45 degrees on the z-axis; uses XYZ order.
let camera = new Camera('ORTHO', [extents * 1.414, -extents * 1.414, extents * 2.121], {
    rotation: [0.785398, 0.0, 0.785398],
})
// bpy.context.object.data.ortho_scale = extents * 7.0
sendObjectToBlender(camera)

// crewate a ground
let plane = new Plane([0, 0, -extents * 1.5], extents * 15.0, { name: 'Ground' })
sendObjectToBlender(plane)

// TODO: TODO: TODO: materials
