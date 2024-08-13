import { Cube, CubeGrid } from 'root/geo'
import { offset } from 'root/geo'
import { random } from 'root/random'
import { BlenderRemote } from '../blender_remote'

const remote = new BlenderRemote()
let finalCount = 0

const sideCount = 6

// spacing between cubes
const padding = 0.025

function subdivide(cube: Cube) {
    const grid = CubeGrid.withCube(cube, 2, 2, 2)
    grid.cubes().forEach((cube) => {
        const insetCube = offset(cube, [-padding / 2.0, -padding / 2.0, -padding / 2.0])
        remote.addObject(insetCube)
        finalCount++
    })
    remote.flush()
}

const grid = new CubeGrid([0, 0, 0], [2.0, 2.0, 2.0], sideCount, sideCount, sideCount)
grid.cubes().forEach((cube) => {
    const insetCube = offset(cube, [-padding, -padding, -padding]) as Cube

    // throw to keep or subdivide
    if (random() < 0.4) {
        // subdivide into 2x2
        subdivide(insetCube)
    } else {
        remote.addObject(insetCube)
        finalCount++
    }
})

remote.flush()
console.log('Final count:', finalCount)
