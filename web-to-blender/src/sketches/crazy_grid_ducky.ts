import { BlenderRemote } from '../blender_remote'
import { Collection } from '../lib/Collection'
import { Duplicate } from '../lib/Duplicate'

const remote = new BlenderRemote()

const collection = new Collection('crazy_grid')
remote.add(collection)

const dupe = new Duplicate('object01', 'object01_copy', { position: [0, 0, 0] })
remote.add(collection.link(dupe))

remote.flush()
