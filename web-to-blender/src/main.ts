import './style.css'
import { cleanScene, sendCodeToBlender, sendObjectToBlender } from './blender_remote'
import { Light, Camera, Material } from './lib'
import { Grid, CubeGrid, Cube, Plane } from 'root/geo'
import { offset, centroid } from 'root/geo'

// number of cubes on each axis
const count = 8

// size of grid
const extents = 2.0

// spacing between cubes
const padding = 0.025

// TODO: TODO: TODO: better way to apply materials?
// TODO: apply padding (inset cube)

cleanScene()

const mat = new Material('mat', [1.0, 0.0, 0.0, 1.0])
sendObjectToBlender(mat)

// const grid = new CubeGrid([0, 0, 0], [extents, extents, extents], count, count, count)
const grid = new Grid([0, 0], [extents, extents], count, count)
grid.rects().forEach((rect) => {
    const cube = Cube.withRect(rect)

    const insetCube = offset(cube, [-padding, -padding, -padding])
    sendObjectToBlender(insetCube)
    sendCodeToBlender('bpy.context.object.data.materials.append(bpy.data.materials["mat"])')

    console.log(cube)
})
// grid.cubes().forEach((cube) => {
//     console.log(cube, centroid(cube))

//     const insetCube = offset(cube, [-padding, -padding, -padding])

//     console.log(insetCube, centroid(cube))

//     // let cube = new Cube([0, 1, 2], [3, 4, 5])
//     // cube.attribs = { name: 'a cube', material: mat}

//     sendObjectToBlender(insetCube)

//     // TODO: name the cube specifically and apply a material individually to each cube
//     // let cube = new Cube([0, 1, 2], [3, 4, 5])
//     // cube.attribs = { name: 'hello cube', rotation: [1, 2, 3] }
//     // sendObjectToBlender(cube)
//     // sendCodeToBlender()
// })

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
sendCodeToBlender('bpy.context.object.data.ortho_scale = ' + (extents * 4.0).toString())

// create a ground
let plane = new Plane([0, 0, -extents * 1.5], extents * 15.0, { name: 'Ground' })
sendObjectToBlender(plane)
