export interface BlenderPythonDescribable {
    toBlenderCode(): string
}

export interface Extras {
    name?: string
    material?: string
}

import { toBlenderCode } from '../lib'

export class BlenderRemote {
    queuedCode: string = ''

    constructor(cleanOnStart = true) {
        if (cleanOnStart) {
            this.cleanScene()
        }
    }

    cleanScene() {
        // Removing all of the objects, collection, materials, particles,
        // textures, images, curves, meshes, actions, nodes, and worlds from the scene
        const codeString = `
# make sure the active object is not in Edit Mode
if bpy.context.active_object and bpy.context.active_object.mode == "EDIT":
    bpy.ops.object.editmode_toggle()

# make sure non of the objects are hidden from the viewport, selection, or disabled
for obj in bpy.data.objects:
    obj.hide_set(False)
    obj.hide_select = False
    obj.hide_viewport = False

# select all the object and delete them (just like pressing A + X + D in the viewport)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

# find all the collections and remove them
collection_names = [col.name for col in bpy.data.collections]
for name in collection_names:
    bpy.data.collections.remove(bpy.data.collections[name])

# in the case when you modify the world shader
# delete and recreate the world object
world_names = [world.name for world in bpy.data.worlds]
for name in world_names:
    bpy.data.worlds.remove(bpy.data.worlds[name])
# create a new world data block
bpy.ops.world.new()
bpy.context.scene.world = bpy.data.worlds["World"]
`
        this.sendCodeToBlender(codeString)
    }

    addObject(object: any, extras: Extras = {}) {
        let code = toBlenderCode(object)
        if (code) {
            this.queuedCode += code

            if (extras.material) {
                this.queuedCode +=
                    `bpy.context.object.data.materials.append(bpy.data.materials["${extras.material}"])` + '\n'
            }
            if (extras.name) {
                this.queuedCode += `bpy.context.active_object.name = "${extras.name}"` + '\n'
            }
        } else {
            console.error('Could not convert object to Blender code:', object)
        }
    }

    addCode(code: string) {
        this.queuedCode += code + '\n'
    }

    flush() {
        console.log(this.queuedCode)
        this.sendCodeToBlender(this.queuedCode)
        this.queuedCode = ''
    }

    private sendCodeToBlender(codeString: string) {
        fetch('http://localhost:8080', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: codeString + '\nbpy.context.view_layer.update()',
        })
            .then((response) => response.text())
            .then((data) => {
                console.log('Response from Blender:', data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }
}
