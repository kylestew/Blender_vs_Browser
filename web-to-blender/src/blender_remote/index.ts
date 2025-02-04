import { toBlenderPython } from '../lib/toBlenderPython'

export class BlenderRemote {
    queuedCode: string = ''

    constructor(cleanOnStart = false) {
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

bpy.context.view_layer.update()
`
        this.sendCodeToBlender(codeString)
    }

    add(object: string | any) {
        if (typeof object === 'string') {
            this.queuedCode += object + '\n'
        } else {
            const code = toBlenderPython(object)
            if (code) {
                this.queuedCode += code + '\n'
            } else {
                console.error('Could not convert object to Blender code:', object)
            }
        }
    }

    flush() {
        console.log(this.queuedCode)
        this.sendCodeToBlender(this.queuedCode + '\nbpy.context.view_layer.update()')
        this.queuedCode = ''
    }

    private sendCodeToBlender(codeString: string) {
        fetch('http://localhost:8080', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: codeString,
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
