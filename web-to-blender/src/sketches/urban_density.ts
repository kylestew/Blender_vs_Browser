import { Rectangle, Cube, asPolygon } from 'root/geo'
import { range } from 'root/array'
import { pareto, random, weightedRandom, gaussian } from 'root/random'
import { mapRange } from 'root/math'
import { color } from 'root/color'
import { createCanvas } from 'root/canvas'

import { BlenderRemote } from '../blender_remote'
import { Collection } from '../lib/Collection'
import { material, bevel } from '../lib/modifiers'

// === 2D Workflow ================================================================
const cmd = createCanvas(1200, 1200, undefined, [-20.0, 20.0])
cmd.clear('white')

// draw random rect (width, heights) according to pareto distribution
const cubes = range(0, 5000).map(() => {
    const zOffset = random(0, 2.0)
    const pos = [gaussian(-0.4, 2.4), gaussian(-0.2, 6.5), zOffset]
    const width = pareto(0.28, 1.0)
    const height = pareto(0.05, 1.0)
    const depth = random(0.01, 0.05)

    const alpha = mapRange(depth, 0.01, 0.05, 0.1, 0.6)
    const col = color('#000000').alpha(alpha).toHex()

    // previz as a rectangle
    cmd.draw(new Rectangle(pos.slice(0, 2), [width, height], { fill: col }))

    return new Cube(pos, [width, height, depth])
})
// ===============================================================================

// === 3D Workflow ================================================================
const remote = new BlenderRemote()
let outputCount = 0

const collection = new Collection('Urban')
remote.add(collection)

const mats = ['glass', 'glass_cut']

// spit out all tris to blender
cubes.forEach((cube) => {
    const mat = weightedRandom(mats, [1, 8])
    remote.add(collection.link(material(bevel(cube, 0.01), mat)))
    // remote.add(collection.link(cube))
    outputCount++
})

remote.flush()
console.log('Final count:', outputCount)
// ===============================================================================
