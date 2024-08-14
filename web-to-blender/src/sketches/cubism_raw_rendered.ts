import { CubeGrid, Cube } from 'root/geo'
import { offset } from 'root/geo'
import { random, pickRandom } from 'root/random'
import { wireframe, material } from '../lib/modifiers'
import { BlenderRemote } from '../blender_remote'
import { Collection } from '../lib/Collection'

const remote = new BlenderRemote()
let outputCount = 0

const mats = ['random', 'metal']

// spacing between cubes
const padding = 0.025

function divisionCount(generation: number) {
    if (generation === 0) {
        return 4
    } else if (generation === 1) {
        return pickRandom([2, 3])
    } else if (generation === 2) {
        return pickRandom([2, 3])
    }
    return 4
}

function subdivideDecision(generation: number): boolean {
    if (generation === 0) {
        return random() < random(0.6, 0.8)
    } else if (generation === 1) {
        return random() < random(0.1, 0.3)
    }
    return false
}

function randomRemoveDecision(generation: number): boolean {
    return random() < random(0.65, 0.8)
}

function addRandomModifier(cube: Cube): Cube | string {
    if (Math.random() < 0.4) {
        return material(wireframe(cube), 'metal')
    } else {
        return material(cube, 'random')
    }
}

function subdivideCube(cube: Cube, generation: number = 0) {
    const divisions = divisionCount(generation)
    const grid = CubeGrid.withCube(cube, divisions, divisions, divisions)

    grid.cubes().forEach((cube) => {
        if (subdivideDecision(generation)) {
            subdivideCube(cube, generation + 1)
        } else {
            if (!randomRemoveDecision(generation)) {
                const insetCube = offset(cube, [-padding / 2.0, -padding / 2.0, -padding / 2.0]) as Cube
                remote.add(collection.link(addRandomModifier(insetCube)))
                outputCount++
            }
        }
    })
}

// create a collection and publish it
const collection = new Collection('Cubes')
remote.add(collection)

const baseCube = new Cube([0, 0, 4], [5, 5, 5])
subdivideCube(baseCube)

remote.flush()
console.log('Final count:', outputCount)
