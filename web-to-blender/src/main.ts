import { BlenderRemote } from './blender_remote'
import { Light, Camera } from './lib'
import { Grid, CubeGrid, Cube, Plane } from 'root/geo'
import { offset, centroid, translate } from 'root/geo'

const remote = new BlenderRemote()

// number of cubes on each axis
const count = 8

// size of grid
const extents = 2.0

// spacing between cubes
const padding = 0.025

const grid = new Grid([0, 0], [extents, extents], count, count)
grid.rects().forEach((rect) => {
    const cube = Cube.withRect(rect)

    //     const insetCube = offset(cube, [-padding, -padding, -padding])
    // remote.addObject(cube)

    remote.addObject(translate(cube, [0, 0, Math.random()]), { material: 'mat' })
})
// const grid = new CubeGrid([0, 0, 0], [extents, extents, extents], count, count, count)
// // grid.cubes().forEach((cube) => {
// //     console.log(cube, centroid(cube))

// //     const insetCube = offset(cube, [-padding, -padding, -padding])

// //     console.log(insetCube, centroid(cube))

// //     // let cube = new Cube([0, 1, 2], [3, 4, 5])
// //     // cube.attribs = { name: 'a cube', material: mat}

// //     sendObjectToBlender(insetCube)

// //     // TODO: name the cube specifically and apply a material individually to each cube
// //     // let cube = new Cube([0, 1, 2], [3, 4, 5])
// //     // cube.attribs = { name: 'hello cube', rotation: [1, 2, 3] }
// //     // sendObjectToBlender(cube)
// //     // sendCodeToBlender()
// // })

// add a sun lamp abote the grid
let light = new Light('SUN', 1.0, [0, 0, extents * 1.5])
remote.addObject(light)

// Add an orthographic camera above the grid.
// Rotate 45 degrees on the x-axis, 45 degrees on the z-axis; uses XYZ order.
let camera = new Camera('ORTHO', [extents * 1.414, -extents * 1.414, extents * 2.121], {
    rotation: [0.785398, 0.0, 0.785398],
})
// bpy.context.object.data.ortho_scale = extents * 7.0
remote.addObject(camera)
remote.addCode('bpy.context.object.data.ortho_scale = ' + (extents * 4.0).toString())

// create a ground
let plane = new Plane([0, 0, -extents * 1.5], extents * 15.0)
remote.addObject(plane, { name: 'Ground', material: 'ground' })

remote.flush()
