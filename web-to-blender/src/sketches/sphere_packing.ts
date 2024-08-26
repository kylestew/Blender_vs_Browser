import { Vec3, Sphere } from 'root/geo'
import { pareto, random, weightedRandom, gaussian } from 'root/random'
import { SpherePacking } from 'root/algos'

import { BlenderRemote } from '../blender_remote'
import { Collection } from '../lib/Collection'
import { Duplicate } from '../lib/Duplicate'

const remote = new BlenderRemote()
let outputCount = 0

const collection = new Collection('Spheres')
remote.add(collection)

const packer = new SpherePacking([])

for (let i = 0; i < 100_000; i++) {
    // const pos = [random(-4, 4), random(-2, 2), random(-2, 2)]
    const pos = [gaussian(0, 1), gaussian(0, 1), gaussian(0, 1.6)]

    packer.attemptPlacement(new Sphere(pos, 0.05, 4), 0.01, 2.6)
}

const objs = ['glass', 'marble', 'plastic', 'ceramic', 'silver', 'gold']
packer.packed.forEach((sphere, idx) => {
    const newName = 'copy_' + idx
    const newPos = sphere.pos
    const newScale: Vec3 = [sphere.r, sphere.r, sphere.r]
    const randRot: Vec3 = [random(0, Math.PI), random(0, Math.PI), random(0, Math.PI)]

    const obj = weightedRandom(objs, [1.0, 1.5, 2, 2, 1, 1])

    const dupe = new Duplicate(obj, newName, true, { position: newPos, scale: newScale, rotation: randRot })
    remote.add(collection.link(dupe))

    outputCount++
})

remote.flush()
console.log('Final count:', outputCount)
