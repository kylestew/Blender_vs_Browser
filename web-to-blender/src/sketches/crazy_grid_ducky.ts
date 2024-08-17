import { Vec3, Grid, Sphere } from 'root/geo'
import { random, pickRandom } from 'root/random'
import { material, shadeSmooth } from '../lib/modifiers'
import { Collection } from '../lib/Collection'
import { Duplicate } from '../lib/Duplicate'
import { BlenderRemote } from '../blender_remote'

const remote = new BlenderRemote()
const collection = new Collection('crazy_grid')
remote.add(collection)

const templateObjects = ['object01', 'object02', 'object03', 'object04']

const count = 30
const cells = Math.round(count * 2.1)
const grid = new Grid([0, 0], [cells, cells], count, count)
grid.cells().forEach((cell) => {
    const templateName = pickRandom(templateObjects)
    const newName = 'copy_' + cell.index
    const newPos: Vec3 = [cell.center[0], cell.center[1], random(-1, 1)]
    console.log(templateName, newName, newPos)

    // TODO: might be much faster to instance instead of duplicate
    const dupe = new Duplicate(templateName, newName, true, { position: newPos })
    remote.add(collection.link(dupe))
})

// return material(wireframe(cube), 'metal')
// return material(cube, 'random')

// const sphere = new Sphere([0, 0, 0], 2, 2)
// remote.add(shadeSmooth(sphere))

remote.flush()
