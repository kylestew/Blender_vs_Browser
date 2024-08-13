import { CubeGrid, Cube } from 'root/geo'
import { offset } from 'root/geo'

import { random, pickRandom } from 'root/random'

import { wireframe, material } from '../lib/modifiers'
import { BlenderRemote } from '../blender_remote'

const remote = new BlenderRemote()
let outputCount = 0

const mats = ['random', 'metal']

// spacing between cubes
const padding = 0.025

function divisionCount(generation: number) {
    if (generation === 0) {
        return 6
    } else if (generation === 1) {
        return pickRandom([2, 3])
    }
    return 4
}

function subdivideDecision(generation: number): boolean {
    if (generation === 0) {
        return random() < 0.5
    } else if (generation === 1) {
        return random() < 0.05
    }
    return false
}

function randomRemoveDecision(generation: number): boolean {
    return random() < 0.3333
}

function addRandomModifier(cube: Cube): Cube | string {
    if (Math.random() < 0.2) {
        return wireframe(cube)
    } else {
        return cube
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
                remote.add(material(addRandomModifier(insetCube), 'random'))
                outputCount++
            }
        }
    })
}

const baseCube = new Cube([0, 0, 0], [2, 2, 2])
subdivideCube(baseCube)

remote.flush()
console.log('Final count:', outputCount)
